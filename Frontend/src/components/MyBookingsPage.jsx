import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ApiClient from '../utils/apiClient';

// --- Main Page Component ---

const MyBookingsPage = () => {
    const { user, getIdToken } = useAuth();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                // First fetch the MongoDB user data
                const userResponse = await ApiClient.get(`/api/DB_Routes/user/${user.uid}`);
                if (!userResponse.data?.success || !userResponse.data?.data) {
                    setError('User not found');
                    return;
                }
                
                const response = await ApiClient.get(`/api/explore-events/${userResponse.data.data._id}`);
                if (response.data?.success) {
                    setBookings(response.data.events);
                } else {
                    setError(response.data?.message || 'Failed to fetch events');
                }
            } catch (err) {
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user, getIdToken]);

    // Filter bookings based on activeTab
    const filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const now = new Date();
        if (activeTab === 'upcoming') {
            return bookingDate >= now && (booking.eventStatus === 'Pending' || booking.eventStatus === 'Confirmed');
        } else {
            return bookingDate < now || booking.eventStatus === 'Completed' || booking.eventStatus === 'Cancelled';
        }
    });


    // --- Helper Components ---

    const [expandedId, setExpandedId] = useState(null);

    const VenueBookingCard = ({ booking }) => {
        const isExpanded = expandedId === booking._id;
        
        const statusClass = {
            'Confirmed': 'text-green-400 bg-green-400/10',
            'Pending': 'text-yellow-400 bg-yellow-400/10',
            'Completed': 'text-purple-400 bg-purple-400/10',
            'Cancelled': 'text-red-400 bg-red-400/10',
        }[booking.eventStatus] || 'text-gray-400 bg-gray-400/10';

        const bookingDate = new Date(booking.date);
        const formattedDate = bookingDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <div className={`bg-gray-800/70 border border-gray-700/50 p-6 rounded-xl shadow-lg transition-all duration-300 ${isExpanded ? 'shadow-purple-700/30' : 'hover:shadow-purple-700/30'}`}>
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-poppins font-semibold text-white">{booking.name}</h2>
                    <span className={`px-4 py-1 text-sm font-medium rounded-full ${statusClass}`}>
                        {booking.eventStatus}
                    </span>
                </div>
                
                <div className="space-y-4 text-gray-300 text-base">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-purple-400" />
                        <span>Date: {formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3 text-purple-400" />
                        <span>Time: {formattedTime}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                        <span>Venue: {booking.venue?.name}</span>
                    </div>
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-3 text-purple-400" />
                        <span>Vendor: {booking.vendor?.businessName}</span>
                    </div>
                </div>

                {/* Expandable Details Section */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-700/50 pt-6 space-y-6">
                        {/* Venue Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-purple-400 mb-3">Venue Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <p className="text-sm text-gray-400">Address</p>
                                    <p>{booking.venue?.address?.addressLine1}</p>
                                    <p>{booking.venue?.address?.addressLine2}</p>
                                    <p>{booking.venue?.address?.city}, {booking.venue?.address?.state} {booking.venue?.address?.pincode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Capacity</p>
                                    <p>{booking.venue?.capacity} people</p>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-purple-400 mb-3">Vendor Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <p className="text-sm text-gray-400">Business</p>
                                    <p>{booking.vendor?.businessName}</p>
                                    <p className="text-sm text-gray-400 mt-2">Contact Person</p>
                                    <p>{booking.vendor?.contactPerson}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Contact</p>
                                    <p>{booking.vendor?.phoneNumber}</p>
                                    <p>{booking.vendor?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-purple-400 mb-3">Event Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <p className="text-sm text-gray-400">Type</p>
                                    <p>{booking.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Description</p>
                                    <p>{booking.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        {booking.services && booking.services.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-purple-400 mb-3">Services Included</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {booking.services.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                        className={`px-6 py-2 ${isExpanded ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700/50 hover:bg-gray-600/50'} text-gray-200 text-sm font-semibold rounded-lg transition-colors`}
                    >
                        {isExpanded ? 'Close Details' : 'View Details'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 font-roboto text-white p-4 md:p-12">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');
                    .font-poppins { font-family: 'Poppins', sans-serif; }
                    .font-roboto { font-family: 'Roboto', sans-serif; }
                `}
            </style>

            <div className="max-w-4xl mx-auto">
                {/* Header and Toggle */}
                <h1 className="text-5xl font-poppins font-bold mb-10 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    My Event Bookings
                </h1>

                <div className="flex justify-start mb-10 gap-4">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                            activeTab === 'upcoming' 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Upcoming Events
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                            activeTab === 'past' 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Past Events
                    </button>
                </div>

                {/* Booking List */}
                <div className="space-y-6">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => <VenueBookingCard key={booking._id} booking={booking} />)
                    ) : (
                        <div className="text-center p-10 bg-gray-800/70 border border-gray-700/50 rounded-xl">
                            <p className="text-xl font-semibold text-gray-400">No {activeTab} bookings found.</p>
                            <p className="mt-2 text-gray-500">Time to book your next venue!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookingsPage;
