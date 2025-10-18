"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Package, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { RatingService } from "@/lib/services/rating-service";
import { RatingModal } from "@/components/ui/rating-modal";
import { RatingDisplay } from "@/components/ui/rating-display";
import { useAuth } from "@/lib/auth/context";

export default function PublicProfile() {
  const params = useParams();
  const { user, userProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [userRatings, setUserRatings] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [existingRating, setExistingRating] = useState(null);
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPublicProfile();
      fetchUserListings();
      fetchRatingData();
    }
  }, [params.id]);

  // Fetch existing rating when user logs in
  useEffect(() => {
    if (user && userProfile && params.id && userProfile.id !== params.id) {
      fetchMyRating();
    }
  }, [user, userProfile, params.id]);

  const fetchPublicProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", params.id)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Profile not found");
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listing")
        .select(`
          *,
          listingImages(url, listing_id)
        `)
        .eq("user_id", params.id)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setListings(data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const fetchRatingData = async () => {
    setLoadingRatings(true);
    try {
      // Fetch rating stats
      const stats = await RatingService.getUserRatingStats(params.id);
      if (!stats.error) {
        setRatingStats(stats);
      }

      // Fetch user ratings with details
      const { data: ratings } = await RatingService.getUserRatings(params.id, 5);
      setUserRatings(ratings);
    } catch (error) {
      console.error("Error fetching rating data:", error);
    } finally {
      setLoadingRatings(false);
    }
  };

  const fetchMyRating = async () => {
    if (!userProfile?.id) return;

    try {
      const { data } = await RatingService.getMyRatingForUser(userProfile.id, params.id);
      setExistingRating(data);
    } catch (error) {
      console.error("Error fetching my rating:", error);
    }
  };

  const handleRateUser = () => {
    if (!user) {
      toast.error("Please sign in to rate users");
      return;
    }

    if (userProfile?.id === params.id) {
      toast.error("You cannot rate yourself");
      return;
    }

    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating, reviewText) => {
    if (!userProfile?.id) {
      toast.error("Please sign in to submit a rating");
      return;
    }

    try {
      const { data, error } = await RatingService.submitRating(
        userProfile.id,
        params.id,
        rating,
        reviewText
      );

      if (error) {
        toast.error("Failed to submit rating");
        console.error("Rating error:", error);
        return;
      }

      toast.success(existingRating ? "Rating updated successfully!" : "Rating submitted successfully!");
      setExistingRating(data);

      // Refresh rating data
      await fetchRatingData();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  };

  const getProfileImage = () => {
    if (!profile) return "/default-avatar.png";

    const imagePath = profile.account_type === "individual"
      ? profile.avatar_path
      : profile.business_image_path;

    if (!imagePath) return "/default-avatar.png";

    if (imagePath.startsWith("http")) return imagePath;

    const bucket = profile.account_type === "individual"
      ? "user-avatars"
      : "business-images";

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${imagePath}`;
  };

  const getDisplayName = () => {
    if (!profile) return "";
    return profile.account_type === "individual"
      ? profile.name
      : profile.business_name;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or is not public.</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <Image
                src={getProfileImage()}
                alt={getDisplayName()}
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-gray-200"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getDisplayName()}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                  {profile.account_type}
                  {profile.account_type !== "individual" && " Business"}
                </span>

                {/* Rating Display */}
                {!loadingRatings && (
                  <RatingDisplay
                    rating={ratingStats.averageRating}
                    totalRatings={ratingStats.totalRatings}
                    showCount={true}
                    size="md"
                  />
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {profile.address && (
                  <div className="flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{profile.address}</span>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center justify-center md:justify-start">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <button
                      onClick={() => copyToClipboard(profile.phone, "Phone number")}
                      className="hover:text-primary hover:underline"
                    >
                      {profile.phone}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <button
                    onClick={() => copyToClipboard(profile.email, "Email")}
                    className="hover:text-primary hover:underline"
                  >
                    {profile.email}
                  </button>
                </div>

                <div className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => window.open(`mailto:${profile.email}`, '_blank')}
                className="flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>

              {profile.phone && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${profile.phone}`, '_blank')}
                  className="flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}

              {/* Rate User Button */}
              {user && userProfile?.id !== params.id && (
                <Button
                  variant="outline"
                  onClick={handleRateUser}
                  className="flex items-center"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {existingRating ? "Update Rating" : "Rate User"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        {ratingStats.totalRatings > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="w-6 h-6 mr-2 fill-yellow-400 text-yellow-400" />
                User Ratings
              </h2>
            </div>

            {/* Recent Ratings */}
            <div className="space-y-4">
              {userRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={
                        rating.rater?.account_type === "individual"
                          ? rating.rater?.avatar_path
                            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-avatars/${rating.rater.avatar_path}`
                            : "/default-avatar.png"
                          : rating.rater?.business_image_path
                          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/business-images/${rating.rater.business_image_path}`
                          : "/default-avatar.png"
                      }
                      alt={rating.rater?.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {rating.rater?.account_type === "individual"
                              ? rating.rater?.name
                              : rating.rater?.business_name}
                          </p>
                          <RatingDisplay
                            rating={rating.rating}
                            showCount={false}
                            size="sm"
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review_text && (
                        <p className="text-sm text-gray-600 mt-2">
                          {rating.review_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 mr-2" />
              Active Listings ({listings.length})
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active listings at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/view-details/${listing.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {listing.listingImages?.[0] && (
                      <div className="aspect-w-16 aspect-h-9">
                        <Image
                          src={listing.listingImages[0].url}
                          alt={listing.title || "Listing"}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {listing.price ? `${listing.price} EGP` : "Free"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          listing.type === "Donate"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {listing.type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{listing.surplusType}</span>
                        <span>{listing.condition}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          userName={getDisplayName()}
          onSubmit={handleSubmitRating}
          existingRating={existingRating}
        />
      </div>
    </div>
  );
}