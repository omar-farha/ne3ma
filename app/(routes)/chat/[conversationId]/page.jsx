"use client";

import { useAuth } from "@/lib/auth/context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatService } from "@/lib/services/chat-service";
import ConversationHeader from "@/components/chat/ConversationHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

/**
 * Chat Conversation Page - Real-time messaging between two users
 */
export default function ChatConversationPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId;

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);

  // Load conversation and messages
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
      return;
    }

    if (conversationId && user?.id) {
      loadConversation();
      loadMessages();
    }
  }, [conversationId, user?.id, authLoading]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = ChatService.subscribeToMessages(
      conversationId,
      (newMessage) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });

        // Mark as read if message is from other user
        if (newMessage.sender_id !== user?.id) {
          ChatService.markMessagesAsRead(conversationId, user.id);
        }
      }
    );

    return () => {
      ChatService.unsubscribe(channel);
    };
  }, [conversationId, user?.id]);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (conversationId && user?.id && messages.length > 0) {
      ChatService.markMessagesAsRead(conversationId, user.id);
    }
  }, [conversationId, user?.id, messages.length]);

  const loadConversation = async () => {
    const { data, error } = await ChatService.getConversation(conversationId);
    if (error) {
      toast.error("Failed to load conversation");
      router.push("/chat");
      return;
    }

    setConversation(data);

    // Determine the other user (using auth_id)
    const other =
      data.participant_1_auth_id === user.id
        ? data.participant_2
        : data.participant_1;
    setOtherUser(other);
  };

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await ChatService.getMessages(conversationId);
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSendMessage = async (content) => {
    if (!user?.id) return;

    const { data, error } = await ChatService.sendMessage(
      conversationId,
      user.id,
      content
    );

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    // Message will be added via real-time subscription
  };

  const handleDeleteConversation = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this conversation? This cannot be undone."
      )
    ) {
      return;
    }

    const { error } = await ChatService.deleteConversation(conversationId);
    if (error) {
      toast.error("Failed to delete conversation");
      return;
    }

    toast.success("Conversation deleted");
    router.push("/chat");
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !conversation) {
    return null;
  }

  return (
    <div className="fixed inset-0 top-[110px] bg-gray-50 flex flex-col">
      {/* Header */}
      <ConversationHeader
        otherUser={otherUser}
        listing={conversation.listing}
        onBack={() => router.push("/chat")}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={user.id}
        loading={false}
      />

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
