import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MarkerItem from "./MarkerItem";
const containerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: 10,
};

function MapSection({ coordinates, listings }) {
  const [center, setCenter] = useState({
    lat: 30.0363,
    lng: 31.4758,
  });
  const [map, setMap] = React.useState(null);

  useEffect(() => {
    coordinates && setCenter(coordinates);
  }, [coordinates]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        onLoad={null}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {listings.map((item, index) => (
          <MarkerItem key={index} item={item} />
        ))}
      </GoogleMap>
    </div>
  );
}

export default MapSection;
