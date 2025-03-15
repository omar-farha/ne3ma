"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Slider from "./_components/Slider";
import Details from "./_components/Details";

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
      .select(`*, listingImages(url, listing_id)`)
      .eq("id", params.id)
      .eq("active", true);
    if (error) {
      console.error("Error fetching listing:", error);
    } else {
      setListingDetail(data[0]);
      console.log(data);
    }
  };

  return (
    <div className="px-4  md:px-32  lg:px-56 py-3">
      <Slider imageList={listingDetail?.listingImages} />
      <Details listingDetail={listingDetail} />
    </div>
  );
}

export default ViewDetails;
