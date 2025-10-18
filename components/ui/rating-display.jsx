"use client";

import { Star } from "lucide-react";

/**
 * Component to display rating stars (read-only)
 * @param {number} rating - The rating value (0-5, can be decimal)
 * @param {number} totalRatings - Total number of ratings
 * @param {boolean} showCount - Whether to show the rating count
 * @param {string} size - Size of the stars ('sm', 'md', 'lg')
 */
export function RatingDisplay({
  rating = 0,
  totalRatings = 0,
  showCount = true,
  size = "md"
}) {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const starSize = sizes[size] || sizes.md;
  const textSize = textSizes[size] || textSizes.md;

  // Round rating to 1 decimal place
  const roundedRating = Math.round(rating * 10) / 10;

  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${starSize} fill-yellow-400 text-yellow-400`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${starSize} text-gray-300`}
          />
        ))}
      </div>

      {/* Rating text */}
      {showCount && (
        <span className={`${textSize} text-gray-600 font-medium`}>
          {roundedRating > 0 ? (
            <>
              {roundedRating.toFixed(1)}
              {totalRatings > 0 && (
                <span className="text-gray-400 ml-0.5">
                  ({totalRatings})
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400">No ratings</span>
          )}
        </span>
      )}
    </div>
  );
}

/**
 * Component to display a simple star rating badge
 */
export function RatingBadge({ rating = 0, totalRatings = 0 }) {
  const roundedRating = Math.round(rating * 10) / 10;

  if (roundedRating === 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
        <Star className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">New</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-full">
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium text-yellow-900">
        {roundedRating.toFixed(1)}
      </span>
      {totalRatings > 0 && (
        <span className="text-xs text-yellow-700">({totalRatings})</span>
      )}
    </div>
  );
}
