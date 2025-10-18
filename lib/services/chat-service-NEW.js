/**
 * Ne3ma Chat Service - FIXED VERSION
 * Uses auth_id instead of user id for compatibility
 */

import { supabase } from "@/utils/supabase/client";

export class ChatService {
  /**
   * Get or create a conversation between two users (using auth_id)
   */
  static async getOrCreateConversation(user1AuthId, user2AuthId, listingId = null) {
    try {
      console.log("🔍 Creating conversation:", { user1AuthId, user2AuthId, listingId });

      const { data, error } = await supabase.rpc("get_or_create_conversation", {
        p_user1_auth_id: user1AuthId,
        p_user2_auth_id: user2AuthId,
        p_listing_id: listingId,
      });

      if (error) {
        console.error("❌ RPC Error:", error);
        throw error;
      }

      console.log("✅ Conversation created/found:", data);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Error getting/creating conversation:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return { data: null, error };
    }
  }

  /**
   * Get all conversations for a user (using auth_id)
   */
  static async getUserConversations(userAuthId) {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          id,
          listing_id,
          participant_1_auth_id,
          participant_2_auth_id,
          created_at,
          updated_at,
          last_message_at,
          listing:listing_id (
            id,
            title,
            price
          )
        `
        )
        .or(`participant_1_auth_id.eq.${userAuthId},participant_2_auth_id.eq.${userAuthId}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      // Get user details for each conversation
      const processedData = await Promise.all(
        data.map(async (conv) => {
          // Determine the other participant's auth_id
          const otherAuthId =
            conv.participant_1_auth_id === userAuthId
              ? conv.participant_2_auth_id
              : conv.participant_1_auth_id;

          // Fetch the other user's details
          const { data: otherUser } = await supabase
            .from("users")
            .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
            .eq("auth_id", otherAuthId)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("content, created_at, sender_auth_id")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            otherParticipant: otherUser,
            lastMessage,
            getDisplayName: () =>
              otherUser?.account_type === "individual"
                ? otherUser?.name
                : otherUser?.business_name,
            getImageUrl: () => {
              const imagePath =
                otherUser?.account_type === "individual"
                  ? otherUser?.avatar_path
                  : otherUser?.business_image_path;

              if (!imagePath) return "/default-avatar.svg";
              if (imagePath.startsWith("http")) return imagePath;

              const bucket =
                otherUser?.account_type === "individual"
                  ? "user-avatars"
                  : "business-images";
              return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${imagePath}`;
            },
          };
        })
      );

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: null, error };
    }
  }

  /**
   * Get a specific conversation with full details
   */
  static async getConversation(conversationId) {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          id,
          listing_id,
          participant_1_auth_id,
          participant_2_auth_id,
          created_at,
          updated_at,
          listing:listing_id (
            id,
            title,
            price,
            address
          )
        `
        )
        .eq("id", conversationId)
        .single();

      if (error) throw error;

      // Fetch both participants' details
      const [participant1, participant2] = await Promise.all([
        supabase
          .from("users")
          .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
          .eq("auth_id", data.participant_1_auth_id)
          .single(),
        supabase
          .from("users")
          .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
          .eq("auth_id", data.participant_2_auth_id)
          .single(),
      ]);

      return {
        data: {
          ...data,
          participant_1: participant1.data,
          participant_2: participant2.data,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return { data: null, error };
    }
  }

  /**
   * Get all messages in a conversation
   */
  static async getMessages(conversationId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_auth_id, content, is_read, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get sender details for each message
      const processedData = await Promise.all(
        data.map(async (msg) => {
          const { data: sender } = await supabase
            .from("users")
            .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
            .eq("auth_id", msg.sender_auth_id)
            .single();

          return {
            ...msg,
            sender_id: msg.sender_auth_id, // For compatibility
            sender,
          };
        })
      );

      return { data: processedData, error: null };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { data: null, error };
    }
  }

  /**
   * Send a new message (using auth_id)
   */
  static async sendMessage(conversationId, senderAuthId, content) {
    try {
      if (!content.trim()) {
        throw new Error("Message content cannot be empty");
      }

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            sender_auth_id: senderAuthId,
            content: content.trim(),
          },
        ])
        .select("id, conversation_id, sender_auth_id, content, is_read, created_at")
        .single();

      if (error) throw error;

      // Get sender details
      const { data: sender } = await supabase
        .from("users")
        .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
        .eq("auth_id", data.sender_auth_id)
        .single();

      return {
        data: {
          ...data,
          sender_id: data.sender_auth_id, // For compatibility
          sender,
        },
        error: null,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return { data: null, error };
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(conversationId, userAuthId) {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_auth_id", userAuthId)
        .eq("is_read", false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { error };
    }
  }

  /**
   * Get unread message count for a user
   */
  static async getUnreadCount(userAuthId) {
    try {
      // Get all conversation IDs for this user
      const { data: conversations, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .or(`participant_1_auth_id.eq.${userAuthId},participant_2_auth_id.eq.${userAuthId}`);

      if (convError) throw convError;

      const conversationIds = conversations.map((c) => c.id);

      if (conversationIds.length === 0) {
        return { data: 0, error: null };
      }

      // Count unread messages
      const { count, error } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .in("conversation_id", conversationIds)
        .neq("sender_auth_id", userAuthId)
        .eq("is_read", false);

      if (error) throw error;
      return { data: count || 0, error: null };
    } catch (error) {
      console.error("Error getting unread count:", error);
      return { data: 0, error };
    }
  }

  /**
   * Subscribe to new messages in a conversation (Real-time)
   */
  static subscribeToMessages(conversationId, callback) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the full message with sender details
          const { data: sender } = await supabase
            .from("users")
            .select("id, auth_id, name, business_name, account_type, avatar_path, business_image_path")
            .eq("auth_id", payload.new.sender_auth_id)
            .single();

          const message = {
            ...payload.new,
            sender_id: payload.new.sender_auth_id, // For compatibility
            sender,
          };

          callback(message);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Subscribe to conversation updates (Real-time)
   */
  static subscribeToConversations(userAuthId, callback) {
    const channel = supabase
      .channel(`conversations:user:${userAuthId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          // Only notify if this user is a participant
          if (
            payload.new.participant_1_auth_id === userAuthId ||
            payload.new.participant_2_auth_id === userAuthId
          ) {
            callback(payload);
          }
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from real-time updates
   */
  static unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(conversationId) {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      return { error };
    }
  }
}
