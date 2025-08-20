import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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
  BookOpen
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const eventTypes = [
    {
      id: 'baby-shower',
      title: 'Baby Shower',
      description: 'Find the perfect venue for your baby shower.',
      image: 'https://images.pexels.com/photos/1973270/pexels-photo-1973270.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Baby
    },
    {
      id: 'birthday',
      title: 'Birthday Party',
      description: 'Find the perfect venue for your birthday party.',
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Cake
    },
    {
      id: 'engagement',
      title: 'Engagement',
      description: 'Book majestic venues for your engagement.',
      image: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Heart
    },
    {
      id: 'wedding',
      title: 'Wedding',
      description: 'Plan your dream wedding with us.',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Crown
    },
    {
      id: 'housewarming',
      title: 'Housewarming',
      description: 'Start your new chapter with love and joy.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Home
    },
    {
      id: 'anniversary',
      title: 'Anniversary',
      description: 'Celebrate everlasting love with a special anniversary venue.',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Gift
    },
    {
      id: 'corporate',
      title: 'Corporate Event',
      description: 'Host professional events in style and comfort.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Building
    },
    {
      id: 'farewell',
      title: 'Farewell',
      description: 'Say goodbye and cherish memories in a special way.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: GraduationCap
    },
    {
      id: 'conference',
      title: 'Conference',
      description: 'Host seamless conferences in fully-equipped venues.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Briefcase
    },
    {
      id: 'workshop',
      title: 'Workshop',
      description: 'Find creative spaces to conduct your next workshop.',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: BookOpen
    }
  ];

  const filteredEvents = eventTypes.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return user?.displayName || user?.email || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-7xl mx-auto shadow-2xl rounded-3xl overflow-hidden min-h-screen">
        {/* Sidebar */}
        <aside className="w-80 bg-gradient-to-b from-slate-800/80 to-purple-900/80 backdrop-blur-xl border-r border-purple-500/20 flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-full flex flex-col items-center">
            {/* Logo */}
            <div className="mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-8 tracking-wider">Eventwala</h1>
            
            {/* User Profile Section */}
            <div className="mb-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mb-3">
                <span className="text-white text-xl font-bold">{getUserInitial()}</span>
              </div>
              <span className="text-white text-sm font-medium text-center">{getUserName()}</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex flex-col gap-4 w-full mb-8">
              <button className="flex items-center gap-4 px-6 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Find Events</span>
              </button>
              <button className="flex items-center gap-4 px-6 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>My Bookings</span>
              </button>
              <button className="flex items-center gap-4 px-6 py-3 text-white hover:bg-purple-600/30 rounded-xl transition-all duration-300 group">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>My Guests</span>
              </button>
            </nav>

            {/* Vendor CTA */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-8 text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Become a Vendor</h3>
              <p className="text-purple-200 text-sm mb-4">List your own venue and services. Reach thousands of customers.</p>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                Get Started
              </button>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-500/30"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-xl p-8 md:p-12 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white">Your Perfect Event Awaits</h2>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Search and Description */}
          <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
            <p className="text-purple-200 text-lg">Select an event type to start planning your special day.</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 w-full md:w-80 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                placeholder="Search for venues or services..."
              />
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <p className="text-purple-300 text-lg">No events found matching your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;