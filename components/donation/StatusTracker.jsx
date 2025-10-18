"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DonationStatusService } from "@/lib/services/donation-status";
import { DONATION_STATUS, getNextPossibleStatuses, getStatusConfig } from "@/lib/constants/donation-status";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { Clock, User, MessageSquare } from "lucide-react";
import { formatTimeAgo } from "@/lib/constants/donation-status";

export default function StatusTracker({ listing, onStatusUpdate }) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  const isOwner = userProfile?.id === listing.user_id;
  const isDonor = userProfile?.id === listing.donor_id;
  const canManage = isOwner || isDonor;

  const handleStatusUpdate = async (newStatus) => {
    if (!canManage) {
      toast.error("You don't have permission to update this status");
      return;
    }

    setLoading(true);

    try {
      const result = await DonationStatusService.updateListingStatus(
        listing.id,
        newStatus,
        `Status updated by ${userProfile.name || userProfile.business_name}`,
        userProfile.id
      );

      if (result.error) {
        toast.error("Failed to update status: " + result.error.message);
      } else {
        toast.success("Status updated successfully!");
        onStatusUpdate?.(result.data);
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDonation = async () => {
    if (!userProfile) {
      toast.error("Please sign in to claim this donation");
      return;
    }

    if (userProfile.id === listing.user_id) {
      toast.error("You cannot claim your own donation");
      return;
    }

    setLoading(true);

    try {
      const result = await DonationStatusService.claimDonation(
        listing.id,
        userProfile.id,
        "Donation claimed via platform"
      );

      if (result.error) {
        toast.error("Failed to claim donation: " + result.error.message);
      } else {
        toast.success("Donation claimed successfully!");
        onStatusUpdate?.(result.data.listing);
      }
    } catch (error) {
      toast.error("An error occurred while claiming donation");
    } finally {
      setLoading(false);
    }
  };

  const loadStatusHistory = async () => {
    if (statusHistory.length === 0) {
      const result = await DonationStatusService.getStatusHistory(listing.id);
      if (result.data) {
        setStatusHistory(result.data);
      }
    }
    setShowHistory(!showHistory);
  };

  const nextStatuses = getNextPossibleStatuses(listing.status);
  const currentConfig = getStatusConfig(listing.status);

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusBadge status={listing.status} />
          <span className="text-sm text-gray-600">{currentConfig.description}</span>
        </div>

        {listing.claimed_at && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Claimed {formatTimeAgo(listing.claimed_at)}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Claim button for available donations */}
        {listing.status === DONATION_STATUS.AVAILABLE && !isOwner && (
          <Button
            onClick={handleClaimDonation}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {loading ? "Claiming..." : "Claim Donation"}
          </Button>
        )}

        {/* Status update buttons for owners/donors */}
        {canManage && nextStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => {
              const config = getStatusConfig(status);
              return (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(status)}
                  disabled={loading}
                  className="text-xs"
                >
                  {config.icon} Mark as {config.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Status history button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={loadStatusHistory}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {showHistory ? "Hide" : "Show"} History
        </Button>
      </div>

      {/* Donor Information */}
      {listing.donor_id && listing.donor && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Donor Information</h4>
          <p className="text-sm text-gray-600">
            {listing.donor.account_type === 'individual'
              ? listing.donor.name
              : listing.donor.business_name}
          </p>
          {listing.donor.account_type !== 'individual' && (
            <p className="text-xs text-gray-500 capitalize">{listing.donor.account_type}</p>
          )}
        </div>
      )}

      {/* Status History */}
      {showHistory && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status History</h4>
          {statusHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No status history available</p>
          ) : (
            <div className="space-y-3">
              {statusHistory.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <StatusBadge status={entry.status} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {getStatusConfig(entry.status).description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(entry.created_at)}
                      </p>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-gray-600 mt-1">{entry.notes}</p>
                    )}
                    {entry.changed_by_user && (
                      <p className="text-xs text-gray-500 mt-1">
                        by {entry.changed_by_user.account_type === 'individual'
                          ? entry.changed_by_user.name
                          : entry.changed_by_user.business_name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completion Notes */}
      {listing.status === DONATION_STATUS.COMPLETED && listing.delivery_notes && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-800 mb-1">Delivery Notes</h4>
          <p className="text-sm text-green-700">{listing.delivery_notes}</p>
        </div>
      )}
    </div>
  );
}