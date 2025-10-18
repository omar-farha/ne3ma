import { supabase } from "@/utils/supabase/client";

export class RatingService {
  /**
   * Submit or update a rating for a user
   * @param {string} raterUserId - ID of the user giving the rating (from users table)
   * @param {string} ratedUserId - ID of the user being rated (from users table)
   * @param {number} rating - Rating value (1-5)
   * @param {string} reviewText - Optional review comment
   * @returns {Promise<{data: any, error: any}>}
   */
  static async submitRating(raterUserId, ratedUserId, rating, reviewText = null) {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        return { data: null, error: { message: "Rating must be between 1 and 5" } };
      }

      // Prevent self-rating
      if (raterUserId === ratedUserId) {
        return { data: null, error: { message: "You cannot rate yourself" } };
      }

      // Check if rating already exists
      const { data: existingRating, error: checkError } = await supabase
        .from("ratings")
        .select("id")
        .eq("rater_id", raterUserId)
        .eq("rated_user_id", ratedUserId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing rating:", checkError);
        return { data: null, error: checkError };
      }

      let result;

      if (existingRating) {
        // Update existing rating
        result = await supabase
          .from("ratings")
          .update({
            rating,
            review_text: reviewText,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingRating.id)
          .select()
          .single();
      } else {
        // Insert new rating
        result = await supabase
          .from("ratings")
          .insert({
            rater_id: raterUserId,
            rated_user_id: ratedUserId,
            rating,
            review_text: reviewText,
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error("Error submitting rating:", result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (error) {
      console.error("Unexpected error in submitRating:", error);
      return { data: null, error };
    }
  }

  /**
   * Get user's rating statistics
   * @param {string} userId - ID of the user (from users table)
   * @returns {Promise<{averageRating: number, totalRatings: number, error: any}>}
   */
  static async getUserRatingStats(userId) {
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("rated_user_id", userId);

      if (error) {
        console.error("Error fetching rating stats:", error);
        return { averageRating: 0, totalRatings: 0, error };
      }

      const totalRatings = data.length;
      const averageRating = totalRatings > 0
        ? data.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings,
        error: null,
      };
    } catch (error) {
      console.error("Unexpected error in getUserRatingStats:", error);
      return { averageRating: 0, totalRatings: 0, error };
    }
  }

  /**
   * Get all ratings for a user with rater details
   * @param {string} userId - ID of the user (from users table)
   * @param {number} limit - Maximum number of ratings to fetch
   * @returns {Promise<{data: any[], error: any}>}
   */
  static async getUserRatings(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select(`
          id,
          rating,
          review_text,
          created_at,
          rater:rater_id (
            id,
            name,
            email,
            avatar_path,
            business_name,
            business_image_path,
            account_type
          )
        `)
        .eq("rated_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching user ratings:", error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error in getUserRatings:", error);
      return { data: [], error };
    }
  }

  /**
   * Get a specific rating by the current user for another user
   * @param {string} raterUserId - ID of the user giving the rating (from users table)
   * @param {string} ratedUserId - ID of the user being rated (from users table)
   * @returns {Promise<{data: any, error: any}>}
   */
  static async getMyRatingForUser(raterUserId, ratedUserId) {
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("rater_id", raterUserId)
        .eq("rated_user_id", ratedUserId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching rating:", error);
        return { data: null, error };
      }

      return { data: data || null, error: null };
    } catch (error) {
      console.error("Unexpected error in getMyRatingForUser:", error);
      return { data: null, error };
    }
  }

  /**
   * Delete a rating
   * @param {string} ratingId - ID of the rating to delete
   * @returns {Promise<{success: boolean, error: any}>}
   */
  static async deleteRating(ratingId) {
    try {
      const { error } = await supabase
        .from("ratings")
        .delete()
        .eq("id", ratingId);

      if (error) {
        console.error("Error deleting rating:", error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected error in deleteRating:", error);
      return { success: false, error };
    }
  }

  /**
   * Check if a user can rate another user
   * (They should not be able to rate themselves)
   * @param {string} raterUserId - ID of the user giving the rating
   * @param {string} ratedUserId - ID of the user being rated
   * @returns {boolean}
   */
  static canRateUser(raterUserId, ratedUserId) {
    return raterUserId !== ratedUserId;
  }

  /**
   * Get top-ranked users with their ratings and listing counts
   * @param {string} accountType - 'individual' or 'business' (optional, if null returns all)
   * @param {number} limit - Maximum number of users to fetch
   * @returns {Promise<{data: any[], error: any}>}
   */
  static async getTopRankedUsers(accountType = null, limit = 10) {
    try {
      let query = supabase
        .from("users")
        .select(`
          id,
          name,
          email,
          account_type,
          avatar_path,
          business_name,
          business_image_path,
          created_at,
          address
        `)
        .eq("is_active", true);

      // Filter by account type if specified
      if (accountType) {
        query = query.eq("account_type", accountType);
      }

      const { data: users, error: usersError } = await query;

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return { data: [], error: usersError };
      }

      if (!users || users.length === 0) {
        return { data: [], error: null };
      }

      // Get ratings and listing counts for all users
      const userIds = users.map(u => u.id);

      // Fetch ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from("ratings")
        .select("rated_user_id, rating")
        .in("rated_user_id", userIds);

      if (ratingsError) {
        console.error("Error fetching ratings:", ratingsError);
      }

      // Fetch listing counts
      const { data: listings, error: listingsError } = await supabase
        .from("listing")
        .select("user_id")
        .in("user_id", userIds)
        .eq("active", true);

      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
      }

      // Calculate stats for each user
      const usersWithStats = users.map(user => {
        // Calculate rating stats
        const userRatings = ratings?.filter(r => r.rated_user_id === user.id) || [];
        const totalRatings = userRatings.length;
        const averageRating = totalRatings > 0
          ? userRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
          : 0;

        // Count listings
        const listingCount = listings?.filter(l => l.user_id === user.id).length || 0;

        // Calculate score (weighted: 70% rating, 30% listing count normalized)
        const normalizedListingCount = Math.min(listingCount / 10, 1); // Cap at 10 listings = 1.0
        const score = (averageRating * 0.7) + (normalizedListingCount * 5 * 0.3);

        return {
          ...user,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings,
          listingCount,
          score: Math.round(score * 100) / 100
        };
      });

      // Filter users with at least 1 rating and sort by score
      const rankedUsers = usersWithStats
        .filter(u => u.totalRatings > 0)
        .sort((a, b) => {
          // First sort by score
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          // If scores are equal, sort by rating count
          if (b.totalRatings !== a.totalRatings) {
            return b.totalRatings - a.totalRatings;
          }
          // If still equal, sort by listing count
          return b.listingCount - a.listingCount;
        })
        .slice(0, limit)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));

      return { data: rankedUsers, error: null };
    } catch (error) {
      console.error("Unexpected error in getTopRankedUsers:", error);
      return { data: [], error };
    }
  }
}
