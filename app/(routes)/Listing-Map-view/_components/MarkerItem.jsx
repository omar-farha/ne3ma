import { MarkerF, OverlayView } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import MarkerCard from "./MarkerCard";

function MarkerItem({ item, isHovered }) {
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <div>
      <MarkerF
        position={item.coordinates}
        onClick={() => setSelectedListing(item)}
        icon={{
          url: isHovered
            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            : "/home.png",
          scaledSize: {
            width: isHovered ? 60 : 50,
            height: isHovered ? 60 : 50,
          },
        }}
        animation={isHovered ? window.google.maps.Animation.BOUNCE : null}
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
