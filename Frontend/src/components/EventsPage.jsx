import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventTypeContext } from '../context/EventTypeContext';

// The cool theme styles from your existing Dashboard.jsx
const theme = {
  background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
  // Removed sidebar related styles
  textMain: "text-white",
  textAccent: "text-purple-300",
  textSubtle: "text-purple-200",
  cardBg: "bg-slate-800/80",
  cardBorder: "border-purple-500/20",
  inputBg: "bg-slate-800/50",
  inputBorder: "border-purple-500/30",
  inputPlaceholder: "placeholder-purple-300",
  inputFocusRing: "focus:ring-purple-400/20",
  primaryButtonBg: "bg-gradient-to-r from-purple-600 to-indigo-600",
  primaryButtonHover: "hover:from-purple-700 hover:to-indigo-700",
  secondaryButtonBg: "bg-transparent",
  secondaryButtonBorder: "border-purple-500/30",
  headerAccent: "bg-gradient-to-r from-purple-500 to-indigo-600",
  offerBannerBg: "bg-gradient-to-r from-purple-600/20 to-indigo-600/20",
  offerBannerText: "text-purple-300",
  userMenuBg: "bg-slate-800/90",
  userMenuBorder: "border-purple-500/20",
  font: "font-poppins",
};

const styleTag = (
  <style>
    {`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .font-poppins {
      font-family: 'Poppins', sans-serif;
    }
    .font-roboto {
      font-family: 'Roboto', sans-serif;
    }
    `}
  </style>
);

// Sidebar content removed

const EventsPage = () => {
  // Removed isFiltersOpen state since sidebar is being removed
  const [promoIndex, setPromoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { eventType } = React.useContext(EventTypeContext);
  const [event, setEvent] = useState([]);

  const promoEvents = [
    "Major Events / Sponsored Events Promo 1",
    "Major Events / Sponsored Events Promo 2",
    "Major Events / Sponsored Events Promo 3",
  ];

  // Filter venues by name or location (city, address, pincode)
  const filteredEvents = event.filter((venue) => {
  const nameMatch = venue.name?.toLowerCase().includes(searchQuery.toLowerCase());
  const cityMatch = venue.address?.city?.toLowerCase().includes(searchQuery.toLowerCase());
  const addressLine1Match = venue.address?.addressLine1?.toLowerCase().includes(searchQuery.toLowerCase());
  const addressLine2Match = venue.address?.addressLine2?.toLowerCase().includes(searchQuery.toLowerCase());
  const pincodeMatch = venue.address?.pincode?.toLowerCase().includes(searchQuery.toLowerCase());
  return nameMatch || cityMatch || addressLine1Match || addressLine2Match || pincodeMatch;
});

  useEffect(() => {
    const timer = setTimeout(() => {
      setPromoIndex((prevIndex) => (prevIndex + 1) % promoEvents.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [promoIndex, promoEvents.length]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `/api/explore-venues?eventTypes=${encodeURIComponent(eventType)}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvent(data.venues || []);
      } catch (err) {
        setEvent([]);
      }
    };
    fetchEvents();
  }, [eventType]);

  // Handler to navigate and pass venue _id
  const handleExplore = (venueId) => {
    navigate(`/venue-vendor-profile/${venueId}`);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${theme.background} ${theme.font} flex flex-col p-4`}
    >
      {styleTag}

      {/* Main Content - now taking full width since sidebar is removed */}
      <main className="w-full p-4 md:p-8 flex flex-col overflow-x-hidden">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textAccent} w-5 h-5`}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-12 pr-6 py-3 w-full ${theme.inputBg} border ${theme.inputBorder} rounded-full ${theme.textMain} ${theme.inputPlaceholder} focus:outline-none focus:border-white/40 focus:ring-2 ${theme.inputFocusRing} transition-all`}
            placeholder="Search events..."
          />
        </div>

        {/* Major/Sponsored Events Promo */}
        <div
          className={`relative ${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6 text-center mb-8`}
        >
          <h3 className={`${theme.textMain} text-xl font-bold mb-4`}>
            Major Events / Sponsored Events Promo
          </h3>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setPromoIndex(
                  (promoIndex - 1 + promoEvents.length) % promoEvents.length
                )
              }
              className="p-2 rounded-full bg-purple-600/20 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex-1 mx-4 text-center">
              <span className={`${theme.textSubtle} text-lg`}>
                {promoEvents[promoIndex]}
              </span>
            </div>
            <button
              onClick={() =>
                setPromoIndex((promoIndex + 1) % promoEvents.length)
              }
              className="p-2 rounded-full bg-purple-600/20 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {promoEvents.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                  index === promoIndex ? "bg-white" : "bg-gray-500"
                }`}
                onClick={() => setPromoIndex(index)}
              ></div>
            ))}
          </div>
        </div>

        {/* Listed Events Grid (from DB) */}
        <div className="mb-8">
          <h3 className={`${theme.textMain} text-2xl font-bold mb-4`}>
            Listed Events Grid
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((venue) => {
              // Filter out empty values and join with comma
              const addressParts = [
                venue.address?.addressLine1,
                venue.address?.addressLine2,
                venue.address?.city,
                venue.address?.pincode,
              ].filter((part) => part && part.trim() !== "");
              return (
                <div
                  key={venue._id}
                  className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden shadow-xl`}
                >
                  {/* Image or Placeholder */}
                  {venue.photos && venue.photos.length > 0 ? (
                    <img
                      src={venue.photos[0].fileId}
                      alt={venue.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-purple-200 text-lg">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className={`${theme.textMain} font-bold text-lg mb-1`}>
                      {venue.name}
                    </h4>
                    <p className={`${theme.textSubtle} text-sm mb-4`}>
                      {addressParts.join(", ")}
                    </p>
                    <button
                      className={`w-full ${theme.primaryButtonBg} ${theme.primaryButtonHover} text-white font-semibold py-2 rounded-full`}
                      onClick={() => handleExplore(venue._id)}
                    >
                      Explore More →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;