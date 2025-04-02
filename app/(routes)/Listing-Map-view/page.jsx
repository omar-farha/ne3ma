"use client";
import { supabase } from "@/utils/supabase/client";
import Listing from "./_components/Listing";
import { useEffect, useState } from "react";
import MapSection from "./_components/MapSection";

function ListingMapView({ type }) {
  const [listings, setListings] = useState([]);
  const [searchAddress, setSearchAddress] = useState();
  const [surplusTypeCount, setSurplusTypeCount] = useState();
  const [conditionCount, setConditionCount] = useState();
  const [amountCount, setAmountCount] = useState(0);
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    getLatestListing();
  }, []);

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`*, listingImages(url, listing_id)`)
      .eq("active", true)
      .eq("type", type)
      .order("id", { ascending: false });

    if (data) {
      setListings(data);
      console.log(data);
    }
    if (error) {
      console.log(error);
    }
  };

  const handelSearchClick = async () => {
    if (
      !searchAddress ||
      !searchAddress.value ||
      !searchAddress.value.structured_formatting
    ) {
      console.log("No search term provided");
      return;
    }

    const searchTrem = searchAddress?.value?.structured_formatting?.main_text;
    console.log("Searching for:", searchTrem);

    let query = supabase
      .from("listing")
      .select(`*, listingImages(url, listing_id)`)
      .eq("active", true)
      .eq("type", type)
      .gte("surplusType", surplusTypeCount || 0)
      .gte("condition", conditionCount || 0)
      .gte("amount", amountCount || 0)
      .like("adderss", "%" + searchTrem + "%")
      .order("id", { ascending: false });
    if (surplusTypeCount) {
      query = query.gte("surplusType", surplusTypeCount);
    }
    const { data, error } = await query;
    if (data) {
      setListings(data);
      console.log("Search results:", data);
    }
    if (error) {
      console.log("Error fetching search results:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
      <div className="">
        <Listing
          listings={listings}
          handelSearchClick={handelSearchClick}
          searchAddress={(v) => setSearchAddress(v)}
          setAmountCount={setAmountCount}
          setConditionCount={setConditionCount}
          setSurplusTypeCount={setSurplusTypeCount}
          setCoordinates={setCoordinates}
        />
      </div>
      <div className="fixed right-10 h-full md:w-[350px] lg:w-[450px] xl:w-[680px]">
        <MapSection coordinates={coordinates} listings={listings} />
      </div>
    </div>
  );
}

export default ListingMapView;
