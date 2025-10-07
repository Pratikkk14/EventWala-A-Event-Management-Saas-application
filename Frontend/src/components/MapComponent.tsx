import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationContext } from "../context/LocationContext";
// Import marker icons directly
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const MapComponent = ({ center, zoom = 13 }) => {
  const { latitude, longitude } = useLocationContext();
  // Use context location if available, else fallback to prop or default
  const mapCenter = latitude && longitude ? [latitude, longitude] : (center || [19.033, 73.0297]);
  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mapCenter}>
        <Popup>You are here! 📍</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;


// Example usage for multiple markers with image on hover
//
// const userLocations = [
//   { lat: 19.033, lng: 73.0297, imgUrl: "https://example.com/image1.jpg" },
//   { lat: 19.05, lng: 73.01, imgUrl: "https://example.com/image2.jpg" },
// ];
//
// const [hoveredMarker, setHoveredMarker] = React.useState<number | null>(null);
//
// <MapContainer ...>
//   <TileLayer ... />
//   {userLocations.map((loc, idx) => (
//     <Marker
//       key={idx}
//       position={[loc.lat, loc.lng]}
//       eventHandlers={{
//         mouseover: () => setHoveredMarker(idx),
//         mouseout: () => setHoveredMarker(null),
//       }}
//     >
//       <Popup>You are here! 📍</Popup>
//       {hoveredMarker === idx && (
//         <div
//           style={{
//             position: "absolute",
//             top: -80,
//             left: -50,
//             zIndex: 1000,
//             background: "white",
//             borderRadius: 8,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//             padding: 4,
//             width: 100,
//             height: 100,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <img src={loc.imgUrl} alt="Location" style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 6 }} />
//         </div>
//       )}
//     </Marker>
//   ))}
// </MapContainer>