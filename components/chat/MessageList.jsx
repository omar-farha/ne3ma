"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Loader2 } from "lucide-react";

/**
 * Message List Component with Auto-Scroll
 */
export default function MessageList({ messages, currentUserId, loading }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (messages.length > 0) {
      // Use instant scroll on initial load, smooth for new messages
      const isInitialLoad = messages.length <= 1;
      scrollToBottom(isInitialLoad ? "instant" : "smooth");
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-1">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
    >
      {messages.map((message, index) => {
        const isOwn = message.sender_id === currentUserId;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar = !prevMessage || prevMessage.sender_id !== message.sender_id;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={isOwn}
            showAvatar={showAvatar}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
