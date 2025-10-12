import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    addDoc,
    serverTimestamp,
    doc
} from 'firebase/firestore';
import { Calendar, Clock, MapPin, MessageCircle, Send, User, X } from 'lucide-react';

// Global variables provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock data to simulate user and vendor information
const mockUserId = 'user-abc-123';
const mockVendorId = 'vendor-xyz-456'; 
const mockUserName = 'P. Pujari';
const mockVendorName = 'EventWala Co.';

// --- Data Structures ---

const mockEvents = {
    upcoming: [
        { id: 'e1', title: 'The Grand Wedding Gala', date: '2025-12-15', time: '18:00', venue: 'Royal Palace Hall', status: 'Confirmed', vendorId: mockVendorId },
        { id: 'e2', title: 'Annual Corporate Summit', date: '2025-11-01', time: '09:00', venue: 'Tech Expo Center', status: 'Pending', vendorId: mockVendorId },
    ],
    past: [
        { id: 'e3', title: 'Birthday Bash 2024', date: '2024-05-20', time: '20:00', venue: 'The Lounge Bar', status: 'Completed', vendorId: mockVendorId },
    ]
};

// --- Firebase Initialization and Chat Component ---

const Chat = ({ currentChatId, currentChatPartnerName, currentUserId, db, auth, isChatOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Path for the chat room (using user and vendor IDs)
    const chatRoomId = [currentUserId, mockVendorId].sort().join('_');
    const chatCollectionPath = `/artifacts/${appId}/public/data/chats/${chatRoomId}/messages`;

    // Real-time listener for messages
    useEffect(() => {
        if (!db || !currentUserId || !isChatOpen) return;

        const q = query(
            collection(db, chatCollectionPath),
            orderBy('createdAt', 'asc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
        }, (error) => {
            console.error("Firestore read error:", error);
        });

        return () => unsubscribe();
    }, [db, currentUserId, isChatOpen, chatCollectionPath]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !db || !currentUserId) return;

        try {
            await addDoc(collection(db, chatCollectionPath), {
                text: newMessage.trim(),
                createdAt: serverTimestamp(),
                senderId: currentUserId,
                senderName: mockUserName, // Use the real authenticated user's name here
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!isChatOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
            <div className="w-full max-w-sm h-full max-h-[70vh] bg-gray-900 border border-purple-700/50 rounded-xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 bg-purple-900 flex items-center justify-between border-b border-purple-700">
                    <div className='flex items-center'>
                        <MessageCircle className="w-5 h-5 text-white mr-2" />
                        <h3 className="text-lg font-semibold text-white">
                            Chat with {currentChatPartnerName}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-purple-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">Start the conversation!</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${
                                    msg.senderId === currentUserId 
                                        ? 'bg-purple-600 text-white rounded-br-none' 
                                        : 'bg-gray-700 text-gray-100 rounded-tl-none'
                                }`}>
                                    <div className="text-xs font-semibold mb-1 opacity-70">
                                        {msg.senderId === currentUserId ? 'You' : msg.senderName}
                                    </div>
                                    <p className="text-sm break-words">{msg.text}</p>
                                    <div className="text-xs text-right mt-1 opacity-50">
                                        {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString() : '...'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-purple-700 bg-gray-900 flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Main Page Component ---

const MyBookingsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [events, setEvents] = useState(mockEvents.upcoming);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [firebaseReady, setFirebaseReady] = useState(false);
    const [authInstance, setAuthInstance] = useState(null);
    const [dbInstance, setDbInstance] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(mockUserId); // Mocked user ID

    // 1. Initialize Firebase and Auth
    useEffect(() => {
        if (!firebaseConfig) {
            console.error("Firebase config is missing.");
            return;
        }
        
        try {
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);
            
            setAuthInstance(auth);
            setDbInstance(db);

            const signInAndObserve = async () => {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }

                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setCurrentUserId(user.uid);
                    } else {
                        // Fallback to mock ID if auth fails
                        setCurrentUserId(mockUserId); 
                    }
                    setFirebaseReady(true);
                });
            };

            signInAndObserve();
            
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setFirebaseReady(true); // Still set ready to display UI
        }
        
        // Disable aggressive console logging for firestore
        // setLogLevel('Debug'); 
    }, []);


    // 2. Tab Switching Logic
    useEffect(() => {
        if (activeTab === 'upcoming') {
            setEvents(mockEvents.upcoming);
        } else {
            setEvents(mockEvents.past);
        }
    }, [activeTab]);


    // --- Helper Components ---

    const EventCard = ({ event }) => {
        const statusClass = {
            'Confirmed': 'text-green-400 border-green-400',
            'Pending': 'text-yellow-400 border-yellow-400',
            'Completed': 'text-purple-400 border-purple-400',
            'Cancelled': 'text-red-400 border-red-400',
        }[event.status] || 'text-gray-400 border-gray-400';

        return (
            <div className="bg-gray-800/70 border border-gray-700/50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-700/30">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-poppins font-semibold text-white">{event.title}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClass} border`}>
                        {event.status}
                    </span>
                </div>
                
                <div className="space-y-3 text-gray-300 text-sm">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-purple-400" /> Date: {event.date}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-purple-400" /> Time: {event.time}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-purple-400" /> Venue: {event.venue}</p>
                    <p className="flex items-center"><User className="w-4 h-4 mr-2 text-purple-400" /> Vendor: {mockVendorName}</p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with Vendor
                    </button>
                    <button className="px-4 py-2 border border-gray-600 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-lg transition-colors">
                        Details
                    </button>
                </div>
            </div>
        );
    };

    if (!firebaseReady) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
                <p className="ml-4 text-white">Connecting to services...</p>
            </div>
        );
    }

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
                <h1 className="text-4xl font-poppins font-bold text-center mb-8 text-purple-400">My Event Bookings</h1>

                <div className="flex justify-center mb-10 bg-gray-800 rounded-xl p-1 shadow-inner">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`w-1/2 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                            activeTab === 'upcoming' 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Upcoming Events
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`w-1/2 py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                            activeTab === 'past' 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Past Events
                    </button>
                </div>

                {/* Event List */}
                <div className="space-y-6">
                    {events.length > 0 ? (
                        events.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <div className="text-center p-10 bg-gray-800/70 border border-gray-700/50 rounded-xl">
                            <p className="text-xl font-semibold text-gray-400">No {activeTab} events found.</p>
                            <p className="mt-2 text-gray-500">Time to book your next event!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Chat Button */}
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white shadow-2xl hover:bg-purple-700 transition-colors z-40"
                aria-label="Open Chat"
            >
                <MessageCircle className="w-6 h-6" />
            </button>


            {/* Chat Modal/Panel */}
            {firebaseReady && dbInstance && currentUserId && (
                <Chat 
                    currentChatId={'vendor-chat-1'} // Static ID for now
                    currentChatPartnerName={mockVendorName} 
                    currentUserId={currentUserId} 
                    db={dbInstance} 
                    auth={authInstance} 
                    isChatOpen={isChatOpen} 
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default MyBookingsPage;
