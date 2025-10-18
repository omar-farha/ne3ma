/**
 * Ne3ma Admin Service
 * Provides admin operations for managing users, listings, and chats
 */

import { supabase } from "@/utils/supabase/client";

export class AdminService {
  // ============ AUTHENTICATION ============

  static ADMIN_PASSWORD = "admin123";

  static validatePassword(password) {
    return password === this.ADMIN_PASSWORD;
  }

  static setAdminSession() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_login_time', Date.now().toString());
    }
  }

  static isAuthenticated() {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_authenticated') === 'true';
    }
    return false;
  }

  static logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_login_time');
    }
  }

  // ============ DASHBOARD STATS ============

  static async getDashboardStats() {
    try {
      const [usersResult, listingsResult, conversationsResult, messagesResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('listing').select('id', { count: 'exact', head: true }),
        supabase.from('conversations').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true })
      ]);

      return {
        data: {
          totalUsers: usersResult.count || 0,
          totalListings: listingsResult.count || 0,
          totalConversations: conversationsResult.count || 0,
          totalMessages: messagesResult.count || 0
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error };
    }
  }

  static async getRecentActivity() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, business_name, account_type, email, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return { data: null, error };
    }
  }

  // ============ USER MANAGEMENT ============

  static async getAllUsers(filters = {}) {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.accountType) {
        query = query.eq('account_type', filters.accountType);
      }

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,business_name.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  }

  static async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { data: null, error };
    }
  }

  static async deleteUser(userId) {
    try {
      // Delete user's listings first (use user_id UUID)
      await supabase.from('listing').delete().eq('user_id', userId);

      // Delete user's messages
      const { data: userData } = await supabase
        .from('users')
        .select('auth_id')
        .eq('id', userId)
        .single();

      if (userData?.auth_id) {
        await supabase.from('messages').delete().eq('sender_auth_id', userData.auth_id);

        // Delete conversations where user is participant
        await supabase
          .from('conversations')
          .delete()
          .or(`participant_1_auth_id.eq.${userData.auth_id},participant_2_auth_id.eq.${userData.auth_id}`);
      }

      // Finally delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error };
    }
  }

  static async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  }

  static async getUserListings(userId) {
    try {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user listings:', error);
      return { data: null, error };
    }
  }

  // ============ LISTING MANAGEMENT ============

  static async getAllListings(filters = {}) {
    try {
      let query = supabase
        .from('listing')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.searchTerm) {
        query = query.or(`surplusType.ilike.%${filters.searchTerm}%,adderss.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch user details separately - use user_id (UUID)
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(listing => listing.user_id).filter(Boolean))];

        if (userIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, name, business_name, account_type, email')
            .in('id', userIds);

          // Create user map for quick lookup
          const userMap = new Map();
          users?.forEach(user => {
            userMap.set(user.id, user);
          });

          // Attach user data to listings
          const processedData = data.map(listing => ({
            ...listing,
            users: userMap.get(listing.user_id) || null
          }));

          return { data: processedData, error: null };
        }
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching listings:', error);
      console.error('Error details:', error);
      return { data: [], error };
    }
  }

  static async getListingById(listingId) {
    try {
      const { data, error } = await supabase
        .from('listing')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error) throw error;

      // Fetch user details separately using user_id
      if (data && data.user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('id, name, business_name, account_type, email')
          .eq('id', data.user_id)
          .maybeSingle();

        return {
          data: {
            ...data,
            users: user || null
          },
          error: null
        };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching listing:', error);
      return { data: null, error };
    }
  }

  static async deleteListing(listingId) {
    try {
      const { error } = await supabase
        .from('listing')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting listing:', error);
      return { error };
    }
  }

  static async updateListing(listingId, updates) {
    try {
      const { data, error } = await supabase
        .from('listing')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating listing:', error);
      return { data: null, error };
    }
  }

  // ============ CHAT MANAGEMENT ============

  static async getAllConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          listing_id,
          participant_1_auth_id,
          participant_2_auth_id,
          created_at,
          updated_at,
          last_message_at,
          listing:listing_id (
            id,
            surplusType,
            amount
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get participant details for each conversation
      const processedData = await Promise.all(
        data.map(async (conv) => {
          const [participant1Result, participant2Result] = await Promise.all([
            supabase
              .from('users')
              .select('id, auth_id, name, business_name, account_type, email')
              .eq('auth_id', conv.participant_1_auth_id)
              .maybeSingle(),
            supabase
              .from('users')
              .select('id, auth_id, name, business_name, account_type, email')
              .eq('auth_id', conv.participant_2_auth_id)
              .maybeSingle()
          ]);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_auth_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...conv,
            participant_1: participant1Result.data,
            participant_2: participant2Result.data,
            lastMessage
          };
        })
      );

      return { data: processedData, error: null };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: null, error };
    }
  }

  static async getConversationMessages(conversationId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_auth_id, content, is_read, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender details for each message
      const processedData = await Promise.all(
        data.map(async (msg) => {
          const { data: sender } = await supabase
            .from('users')
            .select('id, auth_id, name, business_name, account_type, email')
            .eq('auth_id', msg.sender_auth_id)
            .maybeSingle();

          return {
            ...msg,
            sender
          };
        })
      );

      return { data: processedData, error: null };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: null, error };
    }
  }

  static async deleteConversation(conversationId) {
    try {
      // Delete messages first
      await supabase.from('messages').delete().eq('conversation_id', conversationId);

      // Delete conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return { error };
    }
  }

  static async deleteMessage(messageId) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { error };
    }
  }

  // ============ BULK OPERATIONS ============

  static async bulkDeleteUsers(userIds) {
    try {
      const results = await Promise.all(
        userIds.map(id => this.deleteUser(id))
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        return { error: `Failed to delete ${errors.length} users` };
      }

      return { error: null };
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      return { error };
    }
  }

  static async bulkDeleteListings(listingIds) {
    try {
      const { error } = await supabase
        .from('listing')
        .delete()
        .in('id', listingIds);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error bulk deleting listings:', error);
      return { error };
    }
  }
}
