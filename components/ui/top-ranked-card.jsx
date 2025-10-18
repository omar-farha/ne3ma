"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, Star, Package, Trophy } from "lucide-react";
import { RatingDisplay } from "./rating-display";

/**
 * Special card for Top 3 ranked users
 */
function TopRankedCardComponent({ user, rank }) {
  const getDisplayName = () => {
    return user.account_type === "individual" ? user.name : user.business_name;
  };

  const getProfileImage = () => {
    const imagePath = user.account_type === "individual"
      ? user.avatar_path
      : user.business_image_path;

    if (!imagePath) return "/default-avatar.png";
    if (imagePath.startsWith("http")) return imagePath;

    const bucket = user.account_type === "individual"
      ? "user-avatars"
      : "business-images";

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${imagePath}`;
  };

  // Medal colors based on rank
  const getMedalColor = () => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600"; // Gold
      case 2:
        return "from-gray-300 to-gray-500"; // Silver
      case 3:
        return "from-orange-400 to-orange-600"; // Bronze
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Trophy className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-8 h-8 text-orange-500" />;
    return null;
  };

  const getRankBadge = () => {
    const badges = {
      1: { text: "1st", gradient: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600", shadow: "shadow-yellow-500/50" },
      2: { text: "2nd", gradient: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500", shadow: "shadow-gray-400/50" },
      3: { text: "3rd", gradient: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600", shadow: "shadow-orange-500/50" }
    };
    return badges[rank] || badges[1];
  };

  const badge = getRankBadge();

  return (
    <Link href={`/profile/${user.id}`} prefetch={true}>
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${getMedalColor()}
          p-[2px]
          hover:scale-105 transition-all duration-300
          shadow-2xl hover:shadow-3xl
        `}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 h-full">
          {/* Rank Badge */}
          <div className="absolute -top-2 -right-2">
            <div className={`
              ${badge.gradient} ${badge.shadow}
              text-white font-bold
              w-16 h-16 rounded-full
              flex items-center justify-center
              text-xl
              shadow-lg
              border-4 border-white
              transform rotate-12
            `}>
              {badge.text}
            </div>
          </div>

          {/* Rank Icon */}
          <div className="flex justify-center mb-4">
            {getRankIcon()}
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <div className={`
              relative rounded-full p-1
              bg-gradient-to-br ${getMedalColor()}
              ${rank === 1 ? "ring-4 ring-yellow-300" : ""}
            `}>
              <Image
                src={getProfileImage()}
                alt={getDisplayName()}
                width={rank === 1 ? 120 : 100}
                height={rank === 1 ? 120 : 100}
                className="rounded-full object-cover bg-white"
              />
              {rank === 1 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Top Seller
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
              {getDisplayName()}
            </h3>

            <p className="text-sm text-gray-500 capitalize mb-3">
              {user.account_type === "individual" ? "Individual" : "Business"}
            </p>

            {/* Rating */}
            <div className="flex justify-center mb-3">
              <RatingDisplay
                rating={user.averageRating}
                totalRatings={user.totalRatings}
                showCount={true}
                size="md"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Star className="w-4 h-4 fill-blue-600" />
                  <span className="text-xs font-medium">Rating</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {user.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-blue-600">
                  {user.totalRatings} review{user.totalRatings !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium">Listings</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {user.listingCount}
                </p>
                <p className="text-xs text-green-600">
                  Active
                </p>
              </div>
            </div>

            {/* Score Badge */}
            {rank === 1 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                <Trophy className="w-4 h-4" />
                Score: {user.score}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export const TopRankedCard = memo(TopRankedCardComponent);
