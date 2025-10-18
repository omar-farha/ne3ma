import { Button } from "@/components/ui/button";
import { StatusBadge, UrgencyBadge, CategoryBadge } from "@/components/ui/status-badge";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth/context";
import { MapPin, Package, Plus, TrashIcon, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/constants/donation-status";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function UserListing() {
  const { user, userProfile } = useAuth();
  const [listing, setListing] = useState();
  useEffect(() => {
    user && GetUserListing();
  }, []);

  const GetUserListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`*, listingImages(url, listing_id)`)
      .eq("user_id", userProfile?.id);
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status || 'available'} />
                  {item.urgency_level && <UrgencyBadge urgency={item.urgency_level} />}
                </div>
                <span className="bg-primary text-white px-2 py-1 text-xs rounded">
                  {item.active ? "Published" : "Draft"}
                </span>
              </div>
              {item.category && (
                <div className="mb-2">
                  <CategoryBadge category={item.category} />
                </div>
              )}
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
                  <MapPin className="h-4 w-4" /> {item.address || "Unknown"}
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
                {item.claimed_at && (
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Claimed {formatTimeAgo(item.claimed_at)}
                  </div>
                )}
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
