"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin } from "lucide-react";
import { RatingDisplay } from "./rating-display";

/**
 * Regular card for ranked users (4th place and below)
 */
function RankingCardComponent({ user, rank }) {
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

  return (
    <Link href={`/profile/${user.id}`} prefetch={true}>
      <div className="
        bg-white rounded-lg shadow-md hover:shadow-xl
        transition-all duration-300 hover:-translate-y-1
        border border-gray-200 hover:border-primary/50
        overflow-hidden
        group
      ">
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Rank Number */}
            <div className="flex-shrink-0">
              <div className="
                w-12 h-12 rounded-full
                bg-gradient-to-br from-gray-100 to-gray-200
                flex items-center justify-center
                font-bold text-lg text-gray-700
                border-2 border-gray-300
                group-hover:from-primary/10 group-hover:to-primary/20
                group-hover:border-primary/50 group-hover:text-primary
                transition-all duration-300
              ">
                {rank}
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src={getProfileImage()}
                alt={getDisplayName()}
                width={60}
                height={60}
                className="rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-primary/50 transition-all"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {getDisplayName()}
              </h3>

              <p className="text-xs text-gray-500 capitalize mb-2">
                {user.account_type === "individual" ? "Individual" : "Business"}
              </p>

              {/* Rating */}
              <div className="mb-2">
                <RatingDisplay
                  rating={user.averageRating}
                  totalRatings={user.totalRatings}
                  showCount={true}
                  size="sm"
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  <span>{user.listingCount} listings</span>
                </div>

                {user.address && (
                  <div className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{user.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Score Badge */}
            <div className="flex-shrink-0">
              <div className="
                bg-gradient-to-br from-primary/10 to-primary/20
                text-primary font-semibold
                px-3 py-1 rounded-full
                text-sm
                group-hover:from-primary group-hover:to-primary/80
                group-hover:text-white
                transition-all duration-300
              ">
                {user.score}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const RankingCard = memo(RankingCardComponent);
