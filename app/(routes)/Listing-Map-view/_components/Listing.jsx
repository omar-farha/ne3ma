import {
  CalendarDays,
  ListOrdered,
  MapPin,
  Package,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import Link from "next/link";

// Dynamically import GoogleSearch to prevent hydration errors
const GoogleSearch = dynamic(() => import("./GoogleSearch"), { ssr: false });

function Listing({
  listings = [],
  handelSearchClick,
  searchAddress,
  setAmountCount,
  setConditionCount,
  setSurplusTypeCount,
  setCoordinates,
}) {
  const [adderss, setAdderss] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Client-side code running...");
    }
  }, []);
  console.log("Listings Data:", listings);

  return (
    <div>
      <div className=" flex-col md:flex-row lg:flex-row  p-3 flex gap-6">
        <GoogleSearch
          selectedAddress={(p) => {
            searchAddress(p);
            setAdderss(p);
          }}
          setCoordinates={setCoordinates}
        />
        <Button className="flex gap-2" onClick={handelSearchClick}>
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>

      <FilterSection
        setAmountCount={setAmountCount}
        setConditionCount={setConditionCount}
        setSurplusTypeCount={setSurplusTypeCount}
      />

      {adderss && (
        <div className="px-3 my-4">
          <h2 className="text-xl">
            Found{" "}
            <span className="text-primary font-bold">
              {listings?.length || 0}
            </span>{" "}
            Result in{" "}
            <span className="text-primary font-bold">
              {adderss?.label || "Unknown"}
            </span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {listings.length > 0
          ? listings.map((item, index) => (
              // <Link src={"/view-details/" + item.id}>
              <Link
                href={item.id ? `/view-details/${item.id}` : "#"}
                key={index}
              >
                <div className="p-2 hover:border hover:border-primary cursor-pointer rounded-lg transition-all ">
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
                  </div>
                </div>
              </Link>
            ))
          : // Placeholder loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg"
                key={index}
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Listing;
