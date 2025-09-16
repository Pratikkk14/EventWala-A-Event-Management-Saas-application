import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";

// The cool theme styles from your existing Dashboard.jsx
const theme = {
  background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
  sidebarBg: "bg-slate-800/80",
  sidebarBorder: "border-white/10",
  sidebarAccent: "bg-purple-600/20",
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

// New component for sidebar content
const SidebarContent = ({ isFiltersOpen, theme }) => (
  <div
    className={`p-4 transition-opacity duration-300 ${
      isFiltersOpen ? "opacity-100" : "opacity-0 hidden"
    }`}
  >
    <h3 className={`${theme.textMain} text-sm font-semibold mb-2`}>
      By Location
    </h3>
    <div className="flex items-center mb-4">
      <MapPin className={`${theme.textAccent} w-4 h-4 mr-2`} />
      <span className={`${theme.textSubtle}`}>Location</span>
    </div>
  </div>
);

const EventsPage = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const promoEvents = [
    "Major Events / Sponsored Events Promo 1",
    "Major Events / Sponsored Events Promo 2",
    "Major Events / Sponsored Events Promo 3",
  ];

  const allEvents = [
    {
      id: 1,
      title: "Event A",
      location: "City A",
      image: "https://placehold.co/400x250/312e81/ffffff?text=Event+A",
    },
    {
      id: 2,
      title: "Event B",
      location: "City B",
      image: "https://placehold.co/400x250/4f46e5/ffffff?text=Event+B",
    },
    {
      id: 3,
      title: "Event C",
      location: "City C",
      image: "https://placehold.co/400x250/6d28d9/ffffff?text=Event+C",
    },
    {
      id: 4,
      title: "Event D",
      location: "City D",
      image: "https://placehold.co/400x250/7c3aed/ffffff?text=Event+D",
    },
    {
      id: 5,
      title: "Event E",
      location: "City E",
      image: "https://placehold.co/400x250/8b5cf6/ffffff?text=Event+E",
    },
    {
      id: 6,
      title: "Event F",
      location: "City F",
      image: "https://placehold.co/400x250/a78bfa/ffffff?text=Event+F",
    },
  ];

  const filteredEvents = allEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPromoIndex((prevIndex) => (prevIndex + 1) % promoEvents.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [promoIndex, promoEvents.length]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${theme.background} ${theme.font} flex flex-col md:flex-row p-4`}
    >
      {styleTag}

    /* Filters Sidebar */
        <aside
          className={`${isFiltersOpen ? "w-64" : "w-16"} ${
            theme.sidebarBg
          } border ${
            theme.sidebarBorder
          } rounded-3xl m-4 transition-all duration-300 ease-in-out flex flex-col h-[calc(100vh-2rem)]`}
        >
          <div
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex justify-between items-center p-4 cursor-pointer"
          >
            <div className="flex items-center">
            <SlidersHorizontal className={`w-6 h-6 ${theme.textMain}`} />
            <h2
              className={`font-bold text-lg ml-2 transition-opacity duration-300 ${
                isFiltersOpen ? "opacity-100" : "opacity-0"
              } ${theme.textMain}`}
            >
              Filters
            </h2>
            </div>
          </div>
          <SidebarContent isFiltersOpen={isFiltersOpen} theme={theme} />
        </aside>

        {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col overflow-x-hidden">
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
              className={`p-2 rounded-full ${theme.sidebarAccent} hover:bg-white/20 transition-colors`}
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
              className={`p-2 rounded-full ${theme.sidebarAccent} hover:bg-white/20 transition-colors`}
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

        {/* Listed Events Grid */}
        <div className="mb-8">
          <h3 className={`${theme.textMain} text-2xl font-bold mb-4`}>
            Listed Events Grid
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden shadow-xl`}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className={`${theme.textMain} font-bold text-lg mb-1`}>
                    {event.title}
                  </h4>
                  <p className={`${theme.textSubtle} text-sm mb-4`}>
                    {event.location}
                  </p>
                  <button
                    className={`w-full ${theme.primaryButtonBg} ${theme.primaryButtonHover} text-white font-semibold py-2 rounded-full`}
                  >
                    Explore More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;