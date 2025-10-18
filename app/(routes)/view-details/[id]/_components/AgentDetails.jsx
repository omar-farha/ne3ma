"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { ChatService } from "@/lib/services/chat-service";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { RatingBadge } from "@/components/ui/rating-display";
import { RatingService } from "@/lib/services/rating-service";

function AgentDetails({ listingDetail }) {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });

  useEffect(() => {
    if (listingDetail?.users?.id) {
      fetchUserRating();
    }
  }, [listingDetail?.users?.id]);

  const fetchUserRating = async () => {
    try {
      const stats = await RatingService.getUserRatingStats(listingDetail.users.id);
      if (!stats.error) {
        setRatingStats(stats);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Please sign in to send messages");
      router.push("/sign-in");
      return;
    }

    if (!user?.id) {
      toast.error("Loading user profile...");
      return;
    }

    // Don't allow messaging yourself
    if (user.id === listingDetail?.users?.auth_id) {
      toast.error("You cannot message yourself");
      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Sending with auth_ids:", {
        currentUser: user.id,
        otherUser: listingDetail.users.auth_id,
        listing: listingDetail.id,
      });

      // Get or create conversation using auth_id
      const { data: conversationId, error } =
        await ChatService.getOrCreateConversation(
          user.id, // This is auth.uid()
          listingDetail.users.auth_id, // Other user's auth_id
          listingDetail.id
        );

      if (error) {
        console.error("❌ Error from service:", error);
        throw error;
      }

      if (!conversationId) {
        console.error("❌ No conversation ID returned");
        throw new Error("No conversation ID returned");
      }

      console.log("✅ Conversation created:", conversationId);
      console.log("🔄 Navigating to:", `/chat/${conversationId}`);

      // Navigate to chat
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-5 items-center justify-between p-5 rounded-lg shadow-md border my-6   ">
      <Link
        href={`/profile/${listingDetail?.users?.id}`}
        className="flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Image
          src={listingDetail?.profileImage}
          alt="profileImage"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{listingDetail?.fullName}</h2>
            <RatingBadge
              rating={ratingStats.averageRating}
              totalRatings={ratingStats.totalRatings}
            />
          </div>
          <h2 className="text-gray-500">{listingDetail?.createdBy}</h2>
        </div>
      </Link>
      <Button onClick={handleSendMessage} disabled={loading} className="gap-2">
        <MessageCircle className="h-4 w-4" />
        {loading ? "Loading..." : "Send Message"}
      </Button>
    </div>
  );
}

export default AgentDetails;
