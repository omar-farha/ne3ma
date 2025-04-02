"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const nextHandler = async () => {
    setLoading(true);

    console.log("Selected Address:", selectedAddress);
    console.log("Coordinates:", coordinates);

    // Check if address already exists to prevent duplicates
    const { data: existingListing } = await supabase
      .from("listing")
      .select("id")
      .eq("address", selectedAddress.label)
      .single();

    if (existingListing) {
      toast("This address is already listed.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("listing")
      .insert([
        {
          adderss: selectedAddress.label,
          coordinates: coordinates,
          createdBy: user?.primaryEmailAddress.emailAddress,
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
