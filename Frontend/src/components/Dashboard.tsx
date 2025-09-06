import React, { useState, useEffect, useRef } from "react";
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

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const textsToAnimate = [
    "Your Perfect Event Awaits",
    "Making Moments Magical",
    "Find Your Dream Venue",
    "Seamlessly Managed Events",
  ];
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1500;

  const userMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const eventTypes = [
    {
      id: "baby-shower",
      title: "Baby Shower",
      description: "Find the perfect venue for your baby shower.",
      image:
        "https://images.pexels.com/photos/1973270/pexels-photo-1973270.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Baby,
    },
    {
      id: "birthday",
      title: "Birthday Party",
      description: "Find the perfect venue for your birthday party.",
      image:
        "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Cake,
    },
    {
      id: "engagement",
      title: "Engagement",
      description: "Book majestic venues for your engagement.",
      image:
        "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Heart,
    },
    {
      id: "wedding",
      title: "Wedding",
      description: "Plan your dream wedding with us.",
      image:
        "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Crown,
    },
    {
      id: "housewarming",
      title: "Housewarming",
      description: "Start your new chapter with love and joy.",
      image:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Home,
    },
    {
      id: "anniversary",
      title: "Anniversary",
      description:
        "Celebrate everlasting love with a special anniversary venue.",
      image:
        "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Gift,
    },
    {
      id: "corporate",
      title: "Corporate Event",
      description: "Host professional events in style and comfort.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Building,
    },
    {
      id: "farewell",
      title: "Farewell",
      description: "Say goodbye and cherish memories in a special way.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: GraduationCap,
    },
    {
      id: "conference",
      title: "Conference",
      description: "Host seamless conferences in fully-equipped venues.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: Briefcase,
    },
    {
      id: "workshop",
      title: "Workshop",
      description: "Find creative spaces to conduct your next workshop.",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
      icon: BookOpen,
    },
  ];

  const filteredEvents = eventTypes.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const offers = [
    { text: "Get 20% off your first booking!", color: "text-purple-300" },
    { text: "Refer a friend, get $50!", color: "text-purple-300" },
    {
      text: "Host a party of 500+ and get a free DJ!",
      color: "text-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden font-sans flex">
      {/* Sidebar - Collapsible with hover */}
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`bg-gradient-to-b from-slate-800/80 to-purple-900/80 backdrop-blur-xl border-r border-purple-500/20 flex-col pt-8 pb-4 px-6 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-64" : "w-24"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Logo and Name */}
          <div
            className={`flex items-center mb-10 transition-all duration-300 ${
              isSidebarExpanded ? "w-full" : "w-10"
            }`}
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isSidebarExpanded ? "mr-3" : "mr-0"
              }`}
            >
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <h1
              className={`text-2xl font-bold text-white tracking-wider transition-opacity duration-300 ${
                isSidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Eventwala
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 w-full mb-10">
            <button className="flex items-center gap-4 px-3 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
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
      <main className="flex-1 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-xl p-8 md:p-12 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            {/* Logo and Name on Header */}
            <div className="flex items-center mb-3 md:hidden">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
            </div>
            {/* Placeholder for the main title, to be handled by the typing animation */}
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
                <button className="flex items-center w-full px-4 py-2 text-white hover:bg-purple-600/30 transition-colors">
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

        {/* Animated Text and Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="relative w-full text-center">
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

          <div className="relative w-full md:flex-1 md:w-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 w-full bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              placeholder="Search for venues or services..."
            />
          </div>
        </div>

        {/* Special Offers (Rolling Banner) */}
        <div className="w-full overflow-hidden relative h-12 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 backdrop-blur-sm shadow-inner-xl flex items-center mb-12">
          <div className="flex animate-scroll-text whitespace-nowrap">
            {offers.map((offer, index) => (
              <span
                key={index}
                className={`px-8 font-semibold text-lg ${offer.color}`}
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
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {event.title}
                </h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105">
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
