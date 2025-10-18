/**
 * صفحة إضافة إعلان جديد
 * هذه الصفحة تسمح للمستخدمين بإضافة إعلان جديد عن تبرع أو طلب فائض
 * الخطوة الأولى: اختيار العنوان والموقع على الخريطة
 *
 * Add New Listing Page
 * This page allows users to add a new listing for donating or requesting surplus items
 * Step 1: Select address and location on map
 */

"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Prevent hydration error
const GoogleSearch = dynamic(
  () => import("@/app/(routes)/Listing-Map-view/_components/GoogleSearch"),
  {
    ssr: false,
  }
);

function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState();
  const [coordinates, setCoordinates] = useState();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const nextHandler = async () => {
    setLoading(true);

    console.log("Selected Address:", selectedAddress);
    console.log("Coordinates:", coordinates);

    const { data, error } = await supabase
      .from("listing")
      .insert([
        {
          adderss: selectedAddress.label,  // Note: database has typo 'adderss'
          coordinates: coordinates,
          createdBy: userProfile?.email, // Keep for backward compatibility
          user_id: userProfile?.id, // New field
          status: 'available',
          category: 'other',
          urgency_level: 'moderate'
        },
      ])
      .select();

    setLoading(false);

    if (data) {
      console.log("new data", data);
      toast("Event has been created.");
      router.replace("/edit-listing/" + data[0].id);
    } else if (error) {
      console.log("error", error);
      toast("Server Error");
    }
  };

  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex flex-col gap-5 items-center justify-center">
        <h2 className="font-bold text-3xl">Add New Listing</h2>
        <div className="w-full p-10 rounded-lg shadow-md border flex flex-col gap-5">
          <h2 className="text-gray-500 text-lg">
            Enter Address which you want to list
          </h2>
          <GoogleSearch
            selectedAddress={(value) => setSelectedAddress(value)}
            setCoordinates={(value) => setCoordinates(value)}
          />
          <Button
            disabled={!selectedAddress || !coordinates || loading}
            onClick={nextHandler}
            className="cursor-pointer"
          >
            {loading ? <Loader className="animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;
