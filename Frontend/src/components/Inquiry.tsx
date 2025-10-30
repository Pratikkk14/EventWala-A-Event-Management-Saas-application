import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Users, Mail, MapPin, Check, ChevronDown, ChevronUp, AlertCircle, Loader2, CalendarDays, DollarSign } from 'lucide-react';
import ApiClient from '../utils/apiClient';
import { useInquiry, Inquiry } from '../context/InquiryContext';
import { debugLocalStorage } from '../utils/localStorage';
import { useAuth } from '../hooks/useAuth';

interface EventApiResponse {
    success: boolean;
    message?: string;
    eventId?: string;
}
interface SortConfig {
    key: keyof Inquiry;
    direction: 'ascending' | 'descending';
}

// --- MOCK DATA ---
// const initialInquiries: Inquiry[] = [
//     // Requests are ordered by oldest first (FCFS)
//     { 
//         id: 101, 
//         client: {
//             name: 'Sarah Chen',
//             email: 'sarah.chen@example.com',
//             phone: '555-123-4567'
//         },
//         event: {
//             type: 'Wedding',
//             name: 'Wedding Reception',
//             date: 'Oct 25, 2026',
//             guests: 150,
//             details: 'Elegant evening reception with full catering'
//         },
//         budget: '$12,000', 
//         venueName: 'Grand Ballroom',
//         eventStatus: 'Pending', 
//         timeAdded: new Date(Date.now() - 50000000) 
//     },
//     { 
//         id: 102, 
//         client: {
//             name: 'Tech Corp.',
//             email: 'tech.corp@example.com',
//             phone: '555-987-6543'
//         },
//         event: {
//             type: 'Corporate Event',
//             name: 'Corporate Dinner',
//             date: 'Nov 10, 2026',
//             guests: 80,
//             details: 'Annual company dinner with presentations'
//         },
//         budget: '$5,500', 
//         venueName: 'Conference Hall',
//         eventStatus: 'Pending', 
//         timeAdded: new Date(Date.now() - 30000000) 
//     },
//     { 
//         id: 103, 
//         client: {
//             name: 'Mike Johnson',
//             email: 'mike.j@example.com',
//             phone: '555-456-7890'
//         },
//         event: {
//             type: 'Birthday Party',
//             name: 'Graduation Party',
//             date: 'Jun 15, 2027',
//             guests: 50,
//             details: 'College graduation celebration'
//         },
//         budget: '$3,000', 
//         venueName: 'Patio Deck',
//         eventStatus: 'Pending', 
//         timeAdded: new Date(Date.now() - 10000000) 
//     },
// ];

// --- HELPER FUNCTIONS ---
const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// --- MAIN COMPONENT: INQUIRY QUEUE ---

const InquiryQueue = () => {
    // Use the context to access shared inquiries
    const { inquiries, updateInquiryStatus, removeInquiry } = useInquiry();
    const { user } = useAuth();
    const [localQueue, setLocalQueue] = useState<Inquiry[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timeAdded', direction: 'ascending' });
    
    // Debug on component mount
    useEffect(() => {
        console.log("InquiryQueue: Component mounted");
        console.log("InquiryQueue: Initial inquiries from context:", inquiries);
        
        // Debug localStorage contents
        debugLocalStorage();
        
        // Check if InquiryContext is working properly
        try {
            const contextTest = useInquiry();
            console.log("InquiryQueue: Context test success:", contextTest);
        } catch (error) {
            console.error("InquiryQueue: Context test failed:", error);
        }
    }, []);
    
    // Use inquiries directly from context
    useEffect(() => {
        console.log("InquiryQueue: Inquiries from context changed:", inquiries);
        setLocalQueue(inquiries);
    }, [inquiries]);

    // Sort the queue based on the current configuration
    const sortedQueue = useMemo(() => {
        console.log("InquiryQueue: Sorting queue with config:", sortConfig);
        console.log("InquiryQueue: Local queue before sorting:", localQueue);
        
        let sortableItems = [...localQueue];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue instanceof Date && bValue instanceof Date) {
                    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                } else {
                    if (String(aValue) < String(bValue)) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (String(aValue) > String(bValue)) return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        console.log("InquiryQueue: Sorted queue:", sortableItems);
        return sortableItems;
    }, [localQueue, sortConfig]);

    // Handle vendor confirming the oldest inquiry (FCFS)
    const handleConfirmOldest = async () => {
        if (sortedQueue.length === 0) return;
        
        setIsProcessing(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // The inquiry to process is the first one in the FCFS-sorted list (timeAdded ascending)
        // Ensure the sort key is 'timeAdded' and direction is 'ascending' for true FCFS
        const oldestInquiry = sortedQueue[0];

        if (oldestInquiry) {
            // Create event object for the backend API
            // Create event data with optional user UID
            const eventData = {
                name: oldestInquiry.event.name,
                type: oldestInquiry.event.type,
                date: new Date(oldestInquiry.event.date),
                description: oldestInquiry.event.details || '',
                host: {
                    name: oldestInquiry.client.name,
                    email: oldestInquiry.client.email,
                    phone: oldestInquiry.client.phone
                },
                venue: oldestInquiry.venueId,
                venueName: oldestInquiry.venueName,
                budget: oldestInquiry.budget,
                guests: oldestInquiry.event.guests,
                eventStatus: "Confirmed",
                userId: user?.uid // Add user ID if authenticated
            };
            
            console.log(`Confirmed Inquiry: ${oldestInquiry.client.name} for ${oldestInquiry.event.name}`);
            console.log("Event data to be sent to backend:", eventData);
            
            try {
                if (oldestInquiry.backendEventId) {
                    console.log(`Updating existing event with ID: ${oldestInquiry.backendEventId}`);
                    
                    // Update existing event status using PUT endpoint
                    const updateResponse = await ApiClient.put<EventApiResponse>(`/api/explore-events/${oldestInquiry.backendEventId}/status`, { eventStatus: 'Confirmed' });
                    if (updateResponse.data?.success) {
                        console.log(`Event status updated successfully for ID: ${oldestInquiry.backendEventId}`);
                    } else {
                        console.error(`Failed to update event status: ${updateResponse.data?.message || 'Unknown error'}`);
                    }
                } else {
                    // If no existing event ID, create a new confirmed event
                    console.log("No existing event ID found, creating new event");
                    
                    // We've already added the userId to the eventData above
                    // No need to modify it again here
                    
                    const response = await ApiClient.put<EventApiResponse>('/explore-events', eventData);
                    const responseData = response.data;
                    
                    console.log("Backend response for event creation:", responseData);
                    
                    if (responseData?.success) {
                        if (responseData.eventId) {
                            console.log(`Event created successfully with ID: ${responseData.eventId}`);
                            // Save the event ID to the inquiry
                            oldestInquiry.backendEventId = responseData.eventId;
                        }
                    } else {
                        console.error("Failed to create event in backend:", responseData?.message || 'Unknown error');
                    }
                }
                
                // Update the inquiry status in the context regardless of backend success
                updateInquiryStatus(oldestInquiry.id, 'Confirmed');
                
                // After a successful confirmation, remove it from the queue after some delay
                setTimeout(() => {
                    removeInquiry(oldestInquiry.id);
                }, 3000);
            } catch (error) {
                console.error("Error confirming event:", error);
                
                // Still update the local inquiry status even if backend fails
                updateInquiryStatus(oldestInquiry.id, 'Confirmed');
                setTimeout(() => {
                    removeInquiry(oldestInquiry.id);
                }, 3000);
            }
        }

        setIsProcessing(false);
    };

    // Create a function to add a new inquiry to the context
    const { addInquiry } = useInquiry();
    
    // Simulate a new inquiry being submitted by a user clicking "Book Venue"
    const handleSimulateNewInquiry = () => {
        const clientNames = ['New Lead 1', 'New Lead 2', 'Aiden Clark', 'Priya Sharma'];
        const eventTypes = ['Birthday Party', 'Conference', 'Holiday Gala', 'Anniversary', 'Wedding'];
        const name = clientNames[Math.floor(Math.random() * clientNames.length)];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const guestCount = Math.floor(Math.random() * 200) + 20;
        
        // Create new inquiry data
        const newInquiryData = {
            client: {
                name: name,
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
            },
            event: {
                type: eventType,
                name: `${name}'s ${eventType}`,
                date: `2026-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
                guests: guestCount,
                details: `${eventType} with ${guestCount} guests. Additional details pending.`
            },
            budget: `$${(Math.random() * 10 + 2).toFixed(1)}k`,
            venueName: 'The Atrium',
            eventStatus: 'Pending' as 'Pending'
        };
        
        // Add to context through addInquiry function
        addInquiry(newInquiryData);
        console.log(`New inquiry simulation added: ${name}`);
    };
    
    // Sort logic handler
    const requestSort = (key: keyof Inquiry) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Table Header Component for sort buttons
    interface SortableHeaderProps {
        children: React.ReactNode;
        sortKey: keyof Inquiry;
    }

    const SortableHeader = ({ children, sortKey }: SortableHeaderProps) => {
        const direction = sortConfig.key === sortKey ? sortConfig.direction : null;
        return (
            <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                onClick={() => requestSort(sortKey)}
            >
                <div className="flex items-center">
                    {children}
                    {direction && (
                        <span className="ml-2">
                            {direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                    )}
                </div>
            </th>
        );
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <Clock className="w-7 h-7 mr-3 text-orange-600" />
                    Inquiry Processing Queue
                </h1>
                <button
                    onClick={handleSimulateNewInquiry}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition duration-150"
                >
                    + Simulate New Inquiry
                </button>
            </div>

            {/* FCFS / Next Up Panel */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-t-4 border-orange-500">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Loader2 className="w-5 h-5 mr-2 text-orange-500 animate-spin-slow" />
                        Next Inquiry in Queue (FCFS)
                    </h2>
                    
                    {/* CONFIRM Button */}
                    <button
                        onClick={handleConfirmOldest}
                        disabled={isProcessing || sortedQueue.length === 0}
                        className={`
                            px-6 py-3 rounded-xl font-bold text-white transition duration-200 shadow-lg
                            flex items-center justify-center min-w-[150px]
                            ${isProcessing || sortedQueue.length === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }
                        `}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5 mr-2" /> Confirm & Process
                            </>
                        )}
                    </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {sortedQueue.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                            <div className="col-span-1 border-r pr-4">
                                <p className="text-sm font-medium text-gray-500">Client/Event</p>
                                <p className="text-lg font-semibold">{sortedQueue[0].client.name}</p>
                                <p className="text-md text-orange-600">{sortedQueue[0].event.name}</p>
                                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                                    sortedQueue[0].eventStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    sortedQueue[0].eventStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    sortedQueue[0].eventStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {sortedQueue[0].eventStatus}
                                </span>
                            </div>
                            <div className="col-span-1 border-r pr-4">
                                <p className="text-sm font-medium text-gray-500">Event Details</p>
                                <div className="flex items-center text-sm">
                                    <CalendarDays size={14} className="mr-2" /> {sortedQueue[0].event.date}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users size={14} className="mr-2" /> {sortedQueue[0].event.guests} Guests
                                </div>
                                <div className="flex items-center text-sm">
                                    <DollarSign size={14} className="mr-2" /> {sortedQueue[0].budget} Budget
                                </div>
                            </div>
                            <div className="col-span-1">
                                <p className="text-sm font-medium text-gray-500">Contact & Venue</p>
                                <div className="flex items-center text-sm">
                                    <Mail size={14} className="mr-2" /> {sortedQueue[0].client.email}
                                </div>
                                <div className="flex items-center text-sm">
                                    <MapPin size={14} className="mr-2" /> {sortedQueue[0].venueName}
                                </div>
                                <p className="text-xs mt-2 text-gray-500">Queued {timeAgo(sortedQueue[0].timeAdded)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
                            <p className="font-semibold">The inquiry queue is currently empty.</p>
                            <p className="mt-2 text-sm">Use the "Simulate New Inquiry" button or submit a booking from a venue page to see inquiries here.</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Full Inquiry Queue Table */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-10">
                Inquiry Queue ({localQueue.length || 0})
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortableHeader sortKey="id">ID</SortableHeader>
                                <SortableHeader sortKey="client">Client</SortableHeader>
                                <SortableHeader sortKey="event">Event</SortableHeader>
                                <SortableHeader sortKey="venueName">Venue</SortableHeader>
                                <SortableHeader sortKey="budget">Budget</SortableHeader>
                                <SortableHeader sortKey="eventStatus">Status</SortableHeader>
                                <SortableHeader sortKey="timeAdded">Time Queued</SortableHeader>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {sortedQueue.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-orange-50/50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inquiry.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{inquiry.client.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.event.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">{inquiry.venueName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inquiry.budget}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            inquiry.eventStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                            inquiry.eventStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            inquiry.eventStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {inquiry.eventStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {timeAgo(inquiry.timeAdded)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedQueue.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                        <p className="font-semibold">No inquiries found</p>
                        <p className="mt-2 text-sm">You'll see all booking inquiries here once customers submit them.</p>
                    </div>
                )}
            </div>
            
            {/* Additional info section */}
            <div className="mt-8 bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">About Inquiry Management</h3>
                <p className="text-sm text-blue-700 mb-4">
                    This page shows all booking inquiries from customers. New inquiries will appear here automatically 
                    when customers submit booking requests from venue pages.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                        <h4 className="font-medium text-blue-800">How it works</h4>
                        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>Inquiries are sorted by submission time (oldest first)</li>
                            <li>Use the "Confirm & Process" button to accept a booking</li>
                            <li>Confirmed bookings will be removed after processing</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                        <h4 className="font-medium text-blue-800">Testing the feature</h4>
                        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>Click "Simulate New Inquiry" to add test data</li>
                            <li>Submit a booking from any venue page</li>
                            <li>All inquiries are saved automatically</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryQueue;
