/**
 * صفحة تفاصيل الإعلان
 * هذه الصفحة تعرض تفاصيل إعلان معين بما في ذلك الصور، الوصف، ومعلومات البائع
 * تتضمن متتبع حالة التبرع وخيارات للتواصل أو الطلب
 *
 * Listing Details Page
 * This page displays details of a specific listing including images, description, and seller information
 * Includes donation status tracker and options to contact or order
 */

"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Slider from "./_components/Slider";
import Details from "./_components/Details";
import StatusTracker from "@/components/donation/StatusTracker";

function ViewDetails() {
  const params = useParams();
  const [listingDetail, setListingDetail] = useState();

  useEffect(() => {
    if (params.id) {
      GetListingData();
    }
  }, [params.id]);

  const GetListingData = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`
        *,
        listingImages(url, listing_id),
        users!listing_user_id_fkey(
          id,
          auth_id,
          name,
          business_name,
          email,
          account_type,
          avatar_path,
          business_image_path
        ),
        donor:users!listing_donor_id_fkey(
          id,
          name,
          business_name,
          account_type
        )
      `)
      .eq("id", params.id)
      .eq("active", true);
    if (error) {
      console.error("Error fetching listing:", error);
    } else {
      const listing = data[0];
      // Add user information to listing for backward compatibility
      if (listing?.users) {
        listing.fullName = listing.users.account_type === 'individual'
          ? listing.users.name
          : listing.users.business_name;
        listing.createdBy = listing.users.email;

        // Construct proper image URL
        const imagePath = listing.users.account_type === 'individual'
          ? listing.users.avatar_path
          : listing.users.business_image_path;

        if (imagePath) {
          // If it's already a full URL, use it
          if (imagePath.startsWith("http")) {
            listing.profileImage = imagePath;
          } else {
            // Otherwise, construct the Supabase Storage URL
            const bucket = listing.users.account_type === 'individual'
              ? "user-avatars"
              : "business-images";
            listing.profileImage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${imagePath}`;
          }
        } else {
          listing.profileImage = "/default-avatar.svg";
        }
      }
      setListingDetail(listing);
      console.log(data);
    }
  };

  const handleStatusUpdate = (updatedListing) => {
    setListingDetail(updatedListing);
  };

  return (
    <div className="px-4 md:px-32 lg:px-56 py-3">
      <Slider imageList={listingDetail?.listingImages} />
      {listingDetail && (
        <div className="my-6">
          <StatusTracker
            listing={listingDetail}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      )}
      <Details listingDetail={listingDetail} />
    </div>
  );
}

export default ViewDetails;
