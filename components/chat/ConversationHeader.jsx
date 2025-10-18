"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Chat Header Component
 */
export default function ConversationHeader({
  otherUser,
  listing,
  onBack,
  onDeleteConversation,
}) {
  const displayName =
    otherUser?.account_type === "individual"
      ? otherUser?.name
      : otherUser?.business_name;

  const avatarPath =
    otherUser?.account_type === "individual"
      ? otherUser?.avatar_path
      : otherUser?.business_image_path;

  const avatarUrl = avatarPath?.startsWith("http")
    ? avatarPath
    : avatarPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${
        otherUser?.account_type === "individual"
          ? "user-avatars"
          : "business-images"
      }/${avatarPath}`
    : "/default-avatar.svg";

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Back button & User Info */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Link
            href={`/profile/${otherUser?.id}`}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors"
          >
            <Image
              src={avatarUrl}
              alt={displayName || "User"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {displayName || "Unknown User"}
              </h3>
              {listing && (
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  About: {listing.title}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Right: Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/profile/${otherUser?.id}`}>View Profile</Link>
            </DropdownMenuItem>
            {listing && (
              <DropdownMenuItem asChild>
                <Link href={`/view-details/${listing.id}`}>View Listing</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={onDeleteConversation}
              className="text-red-600 focus:text-red-600"
            >
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
