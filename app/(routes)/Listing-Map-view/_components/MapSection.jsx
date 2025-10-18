"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import MarkerItem from "./MarkerItem";
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "24px",
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

function MapSection({ coordinates, listings, hoveredItem }) {
  const [center, setCenter] = useState({
    lat: 30.0363,
    lng: 31.4758,
  });
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState("roadmap");

  useEffect(() => {
    coordinates && setCenter(coordinates);
  }, [coordinates]);

  // Pan to hovered item
  useEffect(() => {
    if (hoveredItem && hoveredItem.coordinates && map) {
      map.panTo({
        lat: hoveredItem.coordinates.lat,
        lng: hoveredItem.coordinates.lng,
      });
      map.setZoom(14);
    }
  }, [hoveredItem, map]);

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleRecenter = () => {
    if (map && center) {
      map.panTo(center);
      map.setZoom(13);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const toggleMapType = () => {
    const types = ["roadmap", "satellite", "hybrid"];
    const currentIndex = types.indexOf(mapType);
    const nextType = types[(currentIndex + 1) % types.length];
    setMapType(nextType);
  };

  return (
    <div className="relative h-full">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-gray-200">
            <div className="bg-primary/10 p-2 rounded-xl">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Showing Results</p>
              <p className="text-lg font-bold text-gray-900">
                {listings.length} {listings.length === 1 ? 'Item' : 'Items'}
              </p>
            </div>
          </div>

          <Button
            onClick={toggleMapType}
            className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-xl border border-gray-200"
            size="sm"
          >
            <Layers className="h-4 w-4 mr-2" />
            {mapType === "roadmap" && "Map"}
            {mapType === "satellite" && "Satellite"}
            {mapType === "hybrid" && "Hybrid"}
          </Button>
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl hover:bg-white transition-all border border-gray-200 hover:scale-110"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl hover:bg-white transition-all border border-gray-200 hover:scale-110"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleRecenter}
            className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl hover:bg-white transition-all border border-gray-200 hover:scale-110"
            title="Re-center"
          >
            <Navigation className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: mapStyles,
            mapTypeId: mapType,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          }}
        >
          {listings.map((item, index) => (
            <MarkerItem
              key={index}
              item={item}
              isHovered={hoveredItem?.id === item.id}
            />
          ))}
        </GoogleMap>

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700">Unavailable</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Click on markers to view details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapSection;
