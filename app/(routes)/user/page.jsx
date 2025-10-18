/**
 * صفحة الملف الشخصي للمستخدم
 * هذه الصفحة تعرض معلومات المستخدم الشخصية وإعلاناته
 * يمكن للمستخدم تعديل معلوماته الشخصية، تحميل صورة الملف الشخصي، وإدارة إعلاناته
 *
 * User Profile Page
 * This page displays user personal information and their listings
 * Users can edit their profile information, upload profile picture, and manage their listings
 */

"use client";

import { useAuth } from "@/lib/auth/context";
import { MapPin, Phone, Mail, Package, Calendar, Edit, Save, X, Camera, Loader, LogOut } from "lucide-react";
import UserListing from "./_components/UserListing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

function User() {
  const { user, userProfile, signOut, getUserImage, getDisplayName, updateProfile, uploadFile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const startEditing = () => {
    setIsEditing(true);

    // Only include fields relevant to the account type
    if (userProfile?.account_type === "individual") {
      setEditData({
        name: userProfile?.name || "",
        phone: userProfile?.phone || "",
        address: userProfile?.address || "",
      });
    } else {
      setEditData({
        business_name: userProfile?.business_name || "",
        phone: userProfile?.phone || "",
        address: userProfile?.address || "",
      });
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      let updates = { ...editData };

      // Upload new image if provided
      if (imageFile) {
        const bucket = userProfile?.account_type === "individual" ? "user-avatars" : "business-images";
        const folder = userProfile?.account_type === "individual" ? "avatars" : "images";

        const uploadResult = await uploadFile(imageFile, bucket, folder);
        if (uploadResult.error) {
          toast.error("Failed to upload image: " + uploadResult.error.message);
          return;
        }

        const imageField = userProfile?.account_type === "individual" ? "avatar_path" : "business_image_path";
        updates[imageField] = uploadResult.data.path;
      }

      const result = await updateProfile(updates);
      if (result.error) {
        toast.error("Failed to update profile: " + result.error.message);
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="my-6 md:px-10 lg:px-32 mt-[110px] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show loading while we're waiting for the profile to load
  if (!userProfile && user) {
    return (
      <div className="my-6 md:px-10 lg:px-32 mt-[110px] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  // If no user and not loading, redirect to sign-in
  if (!user && !authLoading) {
    router.push("/sign-in");
    return (
      <div className="my-6 md:px-10 lg:px-32 mt-[110px] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "profile"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Mail className="w-5 h-5 mr-2" />
                My Profile
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "listings"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Package className="w-5 h-5 mr-2" />
                My Listings
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
              <div className="flex-shrink-0 relative">
                <Image
                  src={imagePreview || getUserImage() || "/default-avatar.svg"}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-3 cursor-pointer hover:bg-primary/80 shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {getDisplayName() || "Your Name"}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                        {userProfile?.account_type}
                        {userProfile?.account_type !== "individual" && " Business"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    {!isEditing ? (
                      <Button onClick={startEditing} className="flex items-center">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button onClick={saveProfile} disabled={loading} className="flex items-center">
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={cancelEditing} variant="outline" className="flex items-center">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center lg:justify-start">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{user?.email}</span>
                    </div>

                    {userProfile?.phone && (
                      <div className="flex items-center justify-center lg:justify-start">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{userProfile.phone}</span>
                      </div>
                    )}

                    {userProfile?.address && (
                      <div className="flex items-center justify-center lg:justify-start">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{userProfile.address}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center lg:justify-start">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Member since {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Profile Fields */}
            {isEditing && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userProfile?.account_type === "individual" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <Input
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      <Input
                        value={editData.business_name || ""}
                        onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                        placeholder="Enter business name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Textarea
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Actions */}
            <div className="border-t pt-6 mt-8 flex flex-col sm:flex-row gap-4">
              <Link href={`/profile/${userProfile?.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Public Profile
                </Button>
              </Link>

              <Button
                onClick={signOut}
                variant="outline"
                className="flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <UserListing />
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
