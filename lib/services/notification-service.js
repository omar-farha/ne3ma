import { supabase } from "@/utils/supabase/client";

export class NotificationService {
  // Get unread notification count for current user
  static async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return { data: count || 0, error: null };
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return { data: 0, error };
    }
  }

  // Get notifications for current user
  static async getUserNotifications(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { data: [], error };
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { error };
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { error };
    }
  }

  // Delete notification
  static async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting notification:", error);
      return { error };
    }
  }

  // Subscribe to real-time notifications
  static subscribeToNotifications(userId, callback) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from notifications
  static unsubscribeFromNotifications(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }

  // Create notification (for testing or manual creation)
  static async createNotification(
    userId,
    type,
    title,
    message,
    data = null
  ) {
    try {
      const { data: notification, error } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: userId,
            type,
            title,
            message,
            data,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data: notification, error: null };
    } catch (error) {
      console.error("Error creating notification:", error);
      return { data: null, error };
    }
  }
}
