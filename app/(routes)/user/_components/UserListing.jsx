import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { MapPin, Package, Plus, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function UserListing() {
  const { user } = useUser();
  const [listing, setListing] = useState();
  useEffect(() => {
    user && GetUserListing();
  }, []);

  const GetUserListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`*, listingImages(url, listing_id)`)
      .eq("createdBy", user.primaryEmailAddress.emailAddress);
    setListing(data);
    console.log(data);
  };
  return (
    <div>
      <h2 className="font-bold text-2xl">Manage Your Listing</h2>
      <div
        className="grid
      grid-cols-1 md:grid-cols-2 gap-3"
      >
        {listing &&
          listing.map((item, index) => (
            <div
              className="p-2 m-1  hover:border hover:border-primary cursor-pointer rounded-lg transition-all"
              key={index}
            >
              <h2 className="bg-primary text-white relative px-2 p-1 text-sm w-fit">
                {item.active ? "Publish" : "Draft"}
              </h2>
              <Image
                src={item.listingImages?.[0]?.url || "/fallback.jpg"}
                width={800}
                height={150}
                className="rounded-lg object-cover h-[200px]"
                alt="listing"
              />
              <div className="flex mt-2 flex-col gap-2">
                <h2 className="font-bold text-lg mb-1">{item.price} EGP</h2>
                <h2 className="flex gap-2 text-sm text-gray-400 h-10">
                  <MapPin className="h-4 w-4" /> {item.adderss || "Unknown"}
                </h2>
                <div className="flex gap-2 mt-2 justify-between">
                  <h2 className="flex items-center justify-center gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-400 w-full hover:bg-gray-300 hover:text-black cursor-pointer">
                    <Package className="h-4 w-4" />
                    {item.surplusType || "N/A"}
                  </h2>
                  <h2 className="flex items-center justify-center gap-2 text-sm bg-slate-200 rounded-md p-1 text-gray-400 w-full hover:bg-gray-300 hover:text-black cursor-pointer">
                    <Plus className="h-4 w-4" />
                    {item.amount || 0} items
                  </h2>
                  <h2 className="flex items-center justify-center gap-2 text-sm bg-slate-200 rounded-md p-1 text-gray-400 w-full hover:bg-gray-300 hover:text-black cursor-pointer">
                    {item.condition || "N/A"}
                  </h2>
                </div>
                <div className="flex gap-2 mt-1">
                  <Link href={"/view-details/" + item.id}>
                    <Button size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link href={"/edit-listing/" + item.id}>
                    <Button size="sm" variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="destructive">
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserListing;
