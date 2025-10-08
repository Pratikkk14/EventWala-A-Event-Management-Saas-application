import React, { useState, useEffect, useRef, useContext } from "react";

//@ts-ignore
import { EventTypeContext } from "../context/EventTypeContext";
import { useLocationContext } from "../context/LocationContext";
import { useAuth } from "../hooks/useAuth";

import {
  Search,
  User,
  Calendar,
  Users,
  LogOut,
  Baby,
  Cake,
  Heart,
  Crown,
  Home,
  Gift,
  Building,
  GraduationCap,
  Briefcase,
  BookOpen,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import defaultAvatar from "../images/UserAvatars/Male.png";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {


  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const { getCurrentLocation } = useLocationContext();
  const navigate = useNavigate();

  const textsToAnimate = [
    "Your Perfect Event Awaits",
    "Making Moments Magical",
    "Find Your Dream Venue",
    "Seamlessly Managed Events",
  ];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1500;

  const marqueeStyle: React.CSSProperties = {
    animation: "marquee 20s linear infinite",
    paddingRight: "50px",
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
    `}
    </style>
  );
  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  getCurrentLocation();
    }, []);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = textsToAnimate[textIndex];
      if (isDeleting) {
        setTypedText(currentText.substring(0, typedText.length - 1));
        if (typedText === "") {
          setIsDeleting(false);
          setTextIndex((prevIndex) => (prevIndex + 1) % textsToAnimate.length);
        }
      } else {
        setTypedText(currentText.substring(0, typedText.length + 1));
        if (typedText === currentText) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    typedText,
    isDeleting,
    textIndex,
    textsToAnimate,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Only filter the eventTypes (dummy/static data) here for the dashboard grid
  // Define the event type enum as per backend model
  type EventType =
    | "Baby Shower"
    | "Birthday Party"
    | "Engagement"
    | "Wedding"
    | "Housewarming"
    | "Anniversary"
    | "Corporate Event"
    | "Farewell"
    | "Conference"
    | "Workshop";

  // Interface for event type card (matches backend model fields where relevant)
  interface EventTypeCard {
    id: string; // unique identifier for frontend
    name: EventType; // matches backend eventTypes enum
    description: string;
    image: string;
    icon: React.ElementType;
  }

  // Static event types data (matches backend model for easy API handling)
  const eventTypes: EventTypeCard[] = [
    {
      id: "baby-shower",
      name: "Baby Shower",
      description: "Find the perfect venue for your baby shower.",
      image:
        "https://images.pexels.com/photos/1973270/pexels-photo-1973270.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Baby,
    },
    {
      id: "birthday-party",
      name: "Birthday Party",
      description: "Find the perfect venue for your birthday party.",
      image:
        "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Cake,
    },
    {
      id: "engagement",
      name: "Engagement",
      description: "Book majestic venues for your engagement.",
      image:
        "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Heart,
    },
    {
      id: "wedding",
      name: "Wedding",
      description: "Plan your dream wedding with us.",
      image:
        "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Crown,
    },
    {
      id: "housewarming",
      name: "Housewarming",
      description: "Start your new chapter with love and joy.",
      image:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Home,
    },
    {
      id: "anniversary",
      name: "Anniversary",
      description: "Celebrate everlasting love with a special anniversary venue.",
      image:
        "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Gift,
    },
    {
      id: "corporate-event",
      name: "Corporate Event",
      description: "Host professional events in style and comfort.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Building,
    },
    {
      id: "farewell",
      name: "Farewell",
      description: "Say goodbye and cherish memories in a special way.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: GraduationCap,
    },
    {
      id: "conference",
      name: "Conference",
      description: "Host seamless conferences in fully-equipped venues.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Briefcase,
    },
    {
      id: "workshop",
      name: "Workshop",
      description: "Find creative spaces to conduct your next workshop.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: BookOpen,
    },
  ];

  // Filtered events based on search query
  const filteredEvents = eventTypes.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProfileImage = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    } else {
      return (
        <img
          src={defaultAvatar}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    // TODO: Add custom placeholder image here
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {user?.displayName?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase() ||
            "U"}
        </span>
      </div>
    );
  };

  const renderSidebarProfileImage = () => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    } else { 
      return (
        <img
          src={defaultAvatar}
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    // return (
    //   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
    //     <span className="text-white text-xl font-bold">
    //       {user?.displayName?.charAt(0).toUpperCase() ||
    //         user?.email?.charAt(0).toUpperCase() ||
    //         "U"}
    //     </span>
    //   </div>
    // );
  };

  const offers = [
    {
      text: "Get 20% off your first booking!",
      color: "text-purple-300",
    },
    {
      text: "Refer a friend, get 30% off",
      color: "text-purple-300"
    },
    {
      text: "Host a party of 500+ and get a free DJ!",
      color: "text-purple-300",
    },
    {
      text: "Book a birthday party venue and get a free cake from our side as a gift!",
      color: "text-purple-300",
    },
    {
      text: "Early bird discounts available for limited Venues!",
      color: "text-purple-300"
    },
  ];

  const { setEventType } = useContext(EventTypeContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden font-sans flex">
      {/* Sidebar - Collapsible with hover */}
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`bg-slate-800/80 backdrop-blur-3xl border border-white/10 rounded-3xl m-4 transition-all duration-300 ease-in-out flex flex-col h-screen ${
          isSidebarExpanded ? "w-64" : "w-24"
        }`}
      >
        <div className="flex flex-col items-center p-4">
          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="p-2 rounded-lg text-white hover:bg-purple-500/20 mb-6"
          >
            {isSidebarExpanded ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>

          {/* User Info Preview (in expanded sidebar) */}
          <div
            className={`flex items-center gap-4 mb-8 transition-opacity duration-300 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              {renderSidebarProfileImage()}
            </div>
            <div>
              <div className="text-white font-medium text-lg line-clamp-1">
                {user?.displayName || "Pratik Pujari"}
              </div>
              <div className="text-purple-300 text-xs line-clamp-1">
                {user?.email || "pratik146971@gmail.com"}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 w-full mb-10 px-3">
            <button
              className="flex items-center gap-4 px-3 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group"
              onClick={() => navigate("/all-event-map")}
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 absolute left-16"
                }`}
              >
                Find Events
              </span>
            </button>
            <button className="flex items-center gap-4 px-3 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 absolute left-16"
                }`}
              >
                My Bookings
              </span>
            </button>
            <button className="flex items-center gap-4 px-3 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 absolute left-16"
                }`}
              >
                My Guests
              </span>
            </button>
          </nav>

          {/* Vendor CTA */}
          <div
            className={`bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              Become a Vendor
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              List your own venue and services. Reach thousands of customers.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-xl p-8 md:p-12 flex flex-col overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo and Name on Header */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider">
              Eventwala
            </h1>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative ml-auto" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-lg text-white hover:bg-purple-500/20 transition-all duration-300"
            >
              {renderProfileImage()}
              <span className="hidden md:inline-block text-white font-medium">
                {user?.displayName || user?.email || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl border border-purple-500/20 rounded-lg shadow-xl overflow-hidden z-30">
                <div className="p-4 border-b border-purple-500/20">
                  <div className="text-sm font-medium text-white line-clamp-1">
                    {user?.displayName || user?.email || "User"}
                  </div>
                  <div className="text-xs text-purple-300 line-clamp-1">
                    {user?.email}
                  </div>
                </div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-white hover:bg-purple-600/30 transition-colors"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </button>
                <button className="flex items-center w-full px-4 py-2 text-white hover:bg-purple-600/30 transition-colors">
                  <User className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors border-t border-purple-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Animated Text Section */}
        <div className="relative w-full text-center mb-8">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white">
            <span className="relative">
              {typedText}
              <span className="absolute right-0 bottom-0 border-r-4 border-white animate-blink h-full"></span>
            </span>
          </h2>
          <p className="text-purple-200 text-lg mt-4">
            Select an event type to start planning your special day.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-3 w-full bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
            placeholder="Search for venues or services..."
          />
        </div>

        {/* Special Offers (Rolling Banner) */}
        <div className="w-full overflow-hidden relative h-12 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 backdrop-blur-sm shadow-inner-xl mb-12">
          {styleTag}
          <div
            className="flex whitespace-nowrap min-w-full"
            style={{
              ...marqueeStyle,
              width: "max-content", // This ensures content width
            }}
          >
            {/* First set of offers */}
            {offers.map((offer, index) => (
              <span
                key={`first-${index}`}
                className={`px-8 font-semibold text-lg inline-block ${offer.color}`}
              >
                {offer.text}
              </span>
            ))}
            {/* Duplicate set for seamless loop */}
            {offers.map((offer, index) => (
              <span
                key={`second-${index}`}
                className={`px-8 font-semibold text-lg inline-block ${offer.color}`}
              >
                {offer.text}
              </span>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => {
            const IconComponent = event.icon;
            return (
              <div
                key={event.id}
                className="group bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:scale-105 hover:border-purple-400/40 transition-all duration-300 cursor-pointer shadow-xl"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {event.name}
                </h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105"
                  onClick={() => {
                  setEventType(event.id); // set the whole event object in context
                  navigate(`/venue/${event.id}`);
                  }}
                >
                  Explore →
                </button>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">
              No events found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
