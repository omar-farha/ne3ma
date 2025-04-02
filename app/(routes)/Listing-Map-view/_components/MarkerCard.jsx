import { Button } from "@/components/ui/button";
import { MapPin, Package, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function MarkerCard({ item, closeCard }) {
  return (
    <div>
      <div className="cursor-pointer rounded-lg w-[180px]">
        <X onClick={() => closeCard()} color="red" size="40px" />
        <Image
          src={item.listingImages?.[0]?.url || "/fallback.jpg"}
          width={800}
          height={150}
          className="rounded-lg object-cover h-[120px] w-[180px]"
          alt="listing"
        />
        <div className="bg-white flex flex-col gap-2 p-2">
          <h2 className="font-bold text-lg">{item.price} EGP</h2>
          <h2 className="flex gap-2 text-sm text-gray-400 ">
            <MapPin className="h-4 w-4" /> {item.adderss || "Unknown"}
          </h2>
          <div className="flex gap-2 mt-2 justify-between">
            <h2 className="flex items-center justify-center gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-400 w-full hover:bg-gray-300 hover:text-black cursor-pointer">
              <Package className="h-4 w-4" />
              {item.surplusType || "N/A"}
            </h2>

            <h2 className="flex items-center justify-center gap-2 text-sm bg-slate-200 rounded-md p-1 text-gray-400 w-full hover:bg-gray-300 hover:text-black cursor-pointer">
              {item.condition || "N/A"}
            </h2>
          </div>
          <Link href={"/view-details/" + item.id} className="w-full">
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarkerCard;
