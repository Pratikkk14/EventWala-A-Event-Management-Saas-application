import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import { useLocationContext } from "../context/LocationContext";
import ApiClient from '../utils/apiClient';


// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const MapComponent = ({ center, zoom = 13 }) => {
  
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  const { latitude, longitude } = useLocationContext();
  const mapCenter = latitude && longitude ? [latitude, longitude] : (center || [19.033, 73.0297]);

  // Custom blue dot icon for user location
  const userIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;background:#2563eb;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px #2563eb;display:flex;align-items:center;justify-content:center;"></div>`,
    className: "user-location-dot",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [hoveredGrid, setHoveredGrid] = useState(null);

  // Unified highlight index: marker or grid hover
  const highlightIdx = hoveredMarker !== null ? hoveredMarker : hoveredGrid;
  
  // Refs for grid cards
  const cardRefs = React.useRef([]);
  React.useEffect(() => {
    if (highlightIdx !== null && cardRefs.current[highlightIdx]) {
      cardRefs.current[highlightIdx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightIdx]);
  
  // Stub for navigation (replace with useNavigate if using react-router)
  const [searchPincode, setSearchPincode] = useState("");
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      const fetchEvents = async () => {
        try {
          if (!latitude || !longitude) throw new Error("did not get latitude or/and longitude, check the useLocationContext");
          let query = `lat=${latitude}&lng=${longitude}&radius=3000`;
          if (searchPincode && searchPincode.trim() !== "") {
            // Base64 encode the pincode before adding to query
            const encodedPincode = btoa(searchPincode.trim());
            query += `&pincode=${encodeURIComponent(encodedPincode)}`;
          }
          const response = await ApiClient.get(`/api/explore-venues/all-events?${query}`);
          setLocations(response.data?.locations || []);
        } catch (err) {
          setLocations([]);
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }, 800); // 800ms debounce

    return () => clearTimeout(handler);
  }, [latitude, longitude, searchPincode]);

  // Handler to navigate and pass venue _id
  const handleExplore = (venueId) => {
    navigate(`/venue-vendor-profile/${venueId}`);
  };

  // Custom cluster icon for better visibility
  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div style="background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.3);">${count}</div>`,
      className: "custom-marker-cluster",
      iconSize: [48, 48],
    });
  };
  return (
    <div className="flex w-full h-screen">
      {/* Map Section */}
      <div style={{ width: "75%", position: "relative" }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* User location marker */}
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
            {locations.map((loc, idx) => (
              <Marker
                key={idx}
                position={loc.position}
                eventHandlers={{
                  mouseover: () => setHoveredMarker(idx),
                  mouseout: () => setHoveredMarker(null),
                }}
              >
                <Popup>{loc.name}</Popup>
                {highlightIdx === idx && (
                  <div
                    style={{
                      position: "absolute",
                      top: -120,
                      left: -100,
                      zIndex: 1000,
                      background: "white",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      padding: 12,
                      width: 220,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <div className="font-bold text-purple-700">{loc.name}</div>
                    <div className="text-xs text-gray-700">{loc.addressLine1}</div>
                    <div className="text-xs text-gray-700">{loc.addressLine2}</div>
                    <div className="text-xs text-gray-500">Pincode: {loc.pincode}</div>
                  </div>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      {/* Right Pane: Grid of location cards (copied logic from EventsPage.jsx) */}
      <div style={{ width: "25%", height: "100vh", overflowY: "auto" }} className="p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Search bar for pincode */}
        <div className="mb-4 relative">
          <input
            type="text"
            value={searchPincode}
            onChange={e => setSearchPincode(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-800/50 border border-purple-500/30 rounded-full text-white placeholder-purple-300 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-purple-400/20 transition-all font-poppins"
            placeholder="Enter custom Pincode to explore venues at different locations"
            maxLength={10}
          />
          <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></span>
            <span className="ml-3 text-purple-300 font-poppins">Loading venues...</span>
          </div>
        )}
        <h3 className="text-white text-xl font-bold mb-4 font-poppins">Locations</h3>
        <div className="grid grid-cols-1 gap-6">
          {locations.map((loc, idx) => {
            // Filter out empty values and join with comma (copied from EventsPage.jsx)
            const addressParts = [
              loc.addressLine1,
              loc.addressLine2,
              loc.city,
              loc.pincode,
            ].filter((part) => part && part.trim() !== "");
            // Highlight if highlightIdx === idx
            const highlightClass = highlightIdx === idx
              ? "ring-4 ring-purple-400 scale-[1.03] shadow-2xl transition-all duration-200"
              : "transition-all duration-200";
            return (
              <div
                key={idx}
                ref={el => cardRefs.current[idx] = el}
                className={`bg-slate-800/80 border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl ${highlightClass}`}
                style={{ cursor: highlightIdx === idx ? "pointer" : "default" }}
                onMouseEnter={() => setHoveredGrid(idx)}
                onMouseLeave={() => setHoveredGrid(null)}
              >
                {/* Image or Placeholder */}
                {loc.image ? (
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-purple-200 text-lg">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-white font-bold text-lg mb-1 font-poppins">
                    {loc.name}
                  </h4>
                  <p className="text-purple-200 text-sm mb-4 font-poppins">
                    {addressParts.join(", ")}
                  </p>
                  <button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-full"
                    onClick={() => handleExplore(loc.id)}
                  >
                    Explore More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;