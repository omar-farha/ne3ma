"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setIsSignedIn(true);
            await fetchUserProfile(session.user.id);
          } else {
            setUser(null);
            setUserProfile(null);
            setIsSignedIn(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            setUser(session.user);
            setIsSignedIn(true);
            // Only fetch profile if we don't already have it or if it's a different user
            if (!userProfile || userProfile.auth_id !== session.user.id) {
              await fetchUserProfile(session.user.id);
            }
          } else {
            setUser(null);
            setUserProfile(null);
            setIsSignedIn(false);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user && authData.session) {
        // Wait a moment for the auth session to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create user profile with the authenticated user
        const profileData = {
          auth_id: authData.user.id,
          email: authData.user.email,
          ...userData,
        };

        const { error: profileError } = await supabase
          .from("users")
          .insert([profileData]);

        if (profileError) {
          console.error("Profile creation error:", JSON.stringify(profileError, null, 2));
          throw profileError;
        }

        // Set the user state immediately
        setUser(authData.user);
        await fetchUserProfile(authData.user.id);
      } else if (authData.user && !authData.session) {
        // User was created but needs email confirmation
        console.log("User created, awaiting email confirmation");
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error("Sign up error:", JSON.stringify(error, null, 2));
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Clear state
      setUser(null);
      setUserProfile(null);
      setIsSignedIn(false);

      // Redirect to home
      router.push("/");

      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user || !userProfile) {
        throw new Error("No user logged in");
      }

      console.log("Starting profile update...");
      console.log("Current userProfile:", userProfile);
      console.log("Updates received:", updates);

      // Clean updates based on account type to satisfy database constraints
      const cleanedUpdates = { ...updates };

      if (userProfile.account_type === 'individual') {
        // For individual users: ensure business fields are null/undefined
        delete cleanedUpdates.business_name;
        delete cleanedUpdates.business_image_path;
        // Ensure name is not empty
        if (cleanedUpdates.name === '') {
          cleanedUpdates.name = userProfile.name || 'Individual User';
        }
      } else {
        // For business users: ensure individual fields are null/undefined
        delete cleanedUpdates.name;
        delete cleanedUpdates.avatar_path;
        // Ensure business_name is not empty
        if (cleanedUpdates.business_name === '') {
          cleanedUpdates.business_name = userProfile.business_name || 'Business';
        }
      }

      console.log("Cleaned updates:", cleanedUpdates);
      console.log("Updating user with auth_id:", user.id);

      // Simplified database operation without timeout - RLS policies should now be optimized
      const { data, error } = await supabase
        .from("users")
        .update(cleanedUpdates)
        .eq("auth_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Update successful:", data);
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Profile update error:", error);
      return { data: null, error };
    }
  };

  const uploadFile = async (file, bucket, folder = null) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${folder ? `${folder}/` : ""}${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return { data: { path: fileName, publicUrl }, error: null };
    } catch (error) {
      console.error("File upload error:", error);
      return { data: null, error };
    }
  };

  // Helper function to get user display name
  const getDisplayName = () => {
    if (!userProfile) return "";
    return userProfile.account_type === "individual"
      ? userProfile.name
      : userProfile.business_name;
  };

  // Helper function to get user image
  const getUserImage = () => {
    if (!userProfile) return null;

    const imagePath = userProfile.account_type === "individual"
      ? userProfile.avatar_path
      : userProfile.business_image_path;

    if (!imagePath) return null;

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) return imagePath;

    // Otherwise, construct the Supabase Storage URL
    const bucket = userProfile.account_type === "individual"
      ? "user-avatars"
      : "business-images";

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${imagePath}`;
  };

  const value = {
    user,
    userProfile,
    loading,
    isSignedIn,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadFile,
    fetchUserProfile,
    getDisplayName,
    getUserImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};