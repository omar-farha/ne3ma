import { MarkerF, OverlayView } from "@react-google-maps/api";
import { useState } from "react";
import MarkerCard from "./MarkerCard";

function MarkerItem({ item }) {
  const [selectedListing, setSelectedListing] = useState(null);
  return (
    <div>
      <MarkerF
        position={item.coordinates}
        onClick={() => setSelectedListing(item)}
        icon={{
          url: "/home.png",
          scaledSize: {
            width: 50,
            height: 50,
          },
        }}
      >
        {selectedListing && (
          <OverlayView
            position={selectedListing.coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div>
              <MarkerCard
                item={selectedListing}
                closeCard={() => setSelectedListing(null)}
              />
            </div>
          </OverlayView>
        )}
      </MarkerF>
    </div>
  );
}

export default MarkerItem;
