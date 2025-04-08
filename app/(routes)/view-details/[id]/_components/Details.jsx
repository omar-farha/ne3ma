import MapSection from "@/app/(routes)/Listing-Map-view/_components/MapSection~";
import { Button } from "@/components/ui/button";
import { GoogleMap } from "@react-google-maps/api";
import { MapPin, Share } from "lucide-react";
import AgentDetails from "./AgentDetails";

function Details({ listingDetail }) {
  return (
    listingDetail && (
      <div className="my-6 flex gap-2 flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-3xl">{listingDetail?.price} EGP</h2>
            <h2 className="text-gray-500 text-lg flex gap-2">
              <MapPin />
              {listingDetail?.adderss}
            </h2>
          </div>
          <Button className="flex gap-2">
            <Share /> Share
          </Button>
        </div>
        <hr />
        <div className="mt-4 flex flex-col gap-3">
          <h2 className="font-bold text-2xl">Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.type}
            </h2>
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.surplusType}
            </h2>
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.amount}
            </h2>
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.date}
            </h2>
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.condition}
            </h2>
            <h2 className="flex gap-.2 items-center bg-red-100 rounded-lg text-primary justify-center p-3">
              {listingDetail?.delivery}
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-bold text-2xl">What's Special</h2>
          <p className="text-gray-600">{listingDetail?.description}</p>
        </div>
        <div>
          <h2 className="font-bold text-2xl">Find On Map</h2>
          <MapSection
            coordinates={listingDetail?.coordinates}
            listings={[listingDetail]}
          />
        </div>
        <div>
          <h2 className="font-bold text-2xl">Contact</h2>

          <AgentDetails listingDetail={listingDetail} />
        </div>
      </div>
    )
  );
}
export default Details;
