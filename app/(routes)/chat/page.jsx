/**
 * صفحة الرسائل
 * هذه الصفحة تعرض جميع المحادثات بين المستخدمين
 * يمكن للمستخدمين التواصل مع البائعين والمشترين حول الإعلانات
 *
 * Chat/Messages Page
 * This page displays all conversations between users
 * Users can communicate with sellers and buyers about listings
 */

"use client";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConversationList from "@/components/chat/ConversationList";
import { MessageCircle } from "lucide-react";
export default function ChatInboxPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        </div>
        <p className="text-gray-600">
          Chat with buyers and sellers about your listings
        </p>
      </div>

      {/* Conversation List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ConversationList />
      </div>
    </div>
  );
}
