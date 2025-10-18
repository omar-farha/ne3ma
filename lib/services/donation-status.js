import { supabase } from "@/utils/supabase/client";
import { DONATION_STATUS, NOTIFICATION_TYPES } from "@/lib/constants/donation-status";

export class DonationStatusService {
  // Update listing status
  static async updateListingStatus(listingId, newStatus, notes = null, userId = null) {
    try {
      const { data, error } = await supabase
        .from("listing")
        .update({
          status: newStatus,
          ...(newStatus === DONATION_STATUS.CLAIMED && { claimed_at: new Date().toISOString() }),
          ...(newStatus === DONATION_STATUS.COMPLETED && { completed_at: new Date().toISOString() })
        })
        .eq("id", listingId)
        .select()
        .single();

      if (error) throw error;

      // Create status history entry (trigger will handle this automatically)
      // But we can add manual notes if provided
      if (notes && userId) {
        await this.addStatusHistory(listingId, newStatus, userId, notes);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating listing status:", error);
      return { data: null, error };
    }
  }

  // Add manual status history entry
  static async addStatusHistory(listingId, status, changedBy, notes) {
    try {
      const { data, error } = await supabase
        .from("listing_status_history")
        .insert([{
          listing_id: listingId,
          status,
          changed_by: changedBy,
          notes
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error adding status history:", error);
      return { data: null, error };
    }
  }

  // Get status history for a listing
  static async getStatusHistory(listingId) {
    try {
      const { data, error } = await supabase
        .from("listing_status_history")
        .select(`
          *,
          changed_by_user:users!listing_status_history_changed_by_fkey(
            id,
            name,
            business_name,
            account_type
          )
        `)
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (error) {
      console.error("Error fetching status history:", error);
      return { data: null, error };
    }
  }

  // Claim a donation
  static async claimDonation(listingId, donorId, notes = null) {
    try {
      // First, update the listing status and set donor
      const { data: listingData, error: listingError } = await supabase
        .from("listing")
        .update({
          status: DONATION_STATUS.CLAIMED,
          donor_id: donorId,
          claimed_at: new Date().toISOString()
        })
        .eq("id", listingId)
        .eq("status", DONATION_STATUS.AVAILABLE) // Only allow claiming if available
        .select()
        .single();

      if (listingError) throw listingError;

      // Create donation transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from("donation_transactions")
        .insert([{
          listing_id: listingId,
          donor_id: donorId,
          recipient_id: listingData.user_id,
          status: 'confirmed',
          notes: notes || 'Donation claimed'
        }])
        .select()
        .single();

      if (transactionError) throw transactionError;

      return { data: { listing: listingData, transaction: transactionData }, error: null };
    } catch (error) {
      console.error("Error claiming donation:", error);
      return { data: null, error };
    }
  }

  // Complete a donation
  static async completeDonation(listingId, deliveryNotes = null, deliveryPhotos = null) {
    try {
      const updateData = {
        status: DONATION_STATUS.COMPLETED,
        completed_at: new Date().toISOString()
      };

      if (deliveryNotes) updateData.delivery_notes = deliveryNotes;
      if (deliveryPhotos) updateData.delivery_photos = deliveryPhotos;

      const { data, error } = await supabase
        .from("listing")
        .update(updateData)
        .eq("id", listingId)
        .select()
        .single();

      if (error) throw error;

      // Update transaction status
      await supabase
        .from("donation_transactions")
        .update({
          status: 'completed',
          delivery_date: new Date().toISOString()
        })
        .eq("listing_id", listingId);

      return { data, error: null };
    } catch (error) {
      console.error("Error completing donation:", error);
      return { data: null, error };
    }
  }

  // Get user's donation transactions
  static async getUserDonations(userId, type = 'all') {
    try {
      let query = supabase
        .from("donation_transactions")
        .select(`
          *,
          listing:listing(*,listingImages(*)),
          donor:users!donation_transactions_donor_id_fkey(id, name, business_name, account_type),
          recipient:users!donation_transactions_recipient_id_fkey(id, name, business_name, account_type)
        `)
        .order("created_at", { ascending: false });

      if (type === 'donor') {
        query = query.eq("donor_id", userId);
      } else if (type === 'recipient') {
        query = query.eq("recipient_id", userId);
      } else {
        query = query.or(`donor_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error("Error fetching user donations:", error);
      return { data: null, error };
    }
  }

  // Send notification
  static async sendNotification(userId, type, title, message, data = null) {
    try {
      const { data: notification, error } = await supabase
        .from("notifications")
        .insert([{
          user_id: userId,
          type,
          title,
          message,
          data
        }])
        .select()
        .single();

      return { data: notification, error };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { data: null, error };
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, unreadOnly = false) {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (unreadOnly) {
        query = query.eq("read", false);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { data: null, error };
    }
  }

  // Mark notification as read
  static async markNotificationRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { data: null, error };
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsRead(userId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      return { data, error };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { data: null, error };
    }
  }

  // Get donation statistics
  static async getDonationStats(userId) {
    try {
      // Get listings stats
      const { data: listingsStats } = await supabase
        .from("listing")
        .select("status")
        .eq("user_id", userId);

      // Get donation stats (as donor)
      const { data: donorStats } = await supabase
        .from("donation_transactions")
        .select("status")
        .eq("donor_id", userId);

      // Get donation stats (as recipient)
      const { data: recipientStats } = await supabase
        .from("donation_transactions")
        .select("status")
        .eq("recipient_id", userId);

      const stats = {
        listings: {
          total: listingsStats?.length || 0,
          available: listingsStats?.filter(l => l.status === DONATION_STATUS.AVAILABLE).length || 0,
          claimed: listingsStats?.filter(l => l.status === DONATION_STATUS.CLAIMED).length || 0,
          completed: listingsStats?.filter(l => l.status === DONATION_STATUS.COMPLETED).length || 0
        },
        donations: {
          given: donorStats?.length || 0,
          received: recipientStats?.length || 0,
          givenCompleted: donorStats?.filter(d => d.status === 'completed').length || 0,
          receivedCompleted: recipientStats?.filter(d => d.status === 'completed').length || 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error fetching donation stats:", error);
      return { data: null, error };
    }
  }
}