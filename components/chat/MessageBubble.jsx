"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

/**
 * Individual Message Bubble Component
 */
export default function MessageBubble({ message, isOwn, showAvatar = true }) {
  const senderName =
    message.sender?.account_type === "individual"
      ? message.sender?.name
      : message.sender?.business_name;

  const avatarPath =
    message.sender?.account_type === "individual"
      ? message.sender?.avatar_path
      : message.sender?.business_image_path;

  const avatarUrl = avatarPath?.startsWith("http")
    ? avatarPath
    : avatarPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${
        message.sender?.account_type === "individual"
          ? "user-avatars"
          : "business-images"
      }/${avatarPath}`
    : "/default-avatar.svg";

  const timeAgo = message.created_at
    ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
    : "";

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={senderName || "User"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div
          className={`max-w-md px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-primary text-white rounded-tr-none"
              : "bg-gray-100 text-gray-900 rounded-tl-none"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 mt-1 px-2">{timeAgo}</span>
      </div>
    </div>
  );
}
