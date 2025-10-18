"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Loader2 } from "lucide-react";
import { ChatService } from "@/lib/services/chat-service";
import { useAuth } from "@/lib/auth/context";

/**
 * Conversation List Component (Inbox)
 */
export default function ConversationList() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadConversations();

      // Subscribe to conversation updates
      const channel = ChatService.subscribeToConversations(
        user.id,
        () => {
          loadConversations();
        }
      );

      return () => {
        ChatService.unsubscribe(channel);
      };
    }
  }, [user?.id]);

  const loadConversations = async () => {
    setLoading(true);
    const { data, error } = await ChatService.getUserConversations(
      user.id
    );
    if (!error && data) {
      setConversations(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">No conversations yet</p>
        <p className="text-sm mt-1">
          Start chatting with sellers on listings
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const displayName = conversation.getDisplayName();
        const avatarUrl = conversation.getImageUrl();
        const lastMessageTime = conversation.lastMessage?.created_at
          ? formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
              addSuffix: true,
            })
          : "";

        const isUnread =
          conversation.lastMessage?.sender_id !== user.id &&
          !conversation.lastMessage?.is_read;

        return (
          <div
            key={conversation.id}
            onClick={() => router.push(`/chat/${conversation.id}`)}
            className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              isUnread ? "bg-blue-50" : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              {isUnread && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3
                  className={`font-medium text-gray-900 truncate ${
                    isUnread ? "font-semibold" : ""
                  }`}
                >
                  {displayName}
                </h3>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {lastMessageTime}
                </span>
              </div>

              {conversation.listing && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  Re: {conversation.listing.surplusType}
                </p>
              )}

              {conversation.lastMessage && (
                <p
                  className={`text-sm text-gray-600 truncate mt-1 ${
                    isUnread ? "font-medium" : ""
                  }`}
                >
                  {conversation.lastMessage.sender_id === user.id
                    ? "You: "
                    : ""}
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
