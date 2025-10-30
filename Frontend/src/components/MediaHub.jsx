import React, { useState, useCallback } from 'react';
import { QrCode, Upload, Image, Calendar, MapPin, Share2, Clipboard, Loader2, X, AlertTriangle } from 'lucide-react';

// Mock data for the current user and their events
const mockUserData = {
    userId: 'CqadsyeMlSUHCEKlDif33fQhfBK2',
    userName: 'Pratik P.',
};

const mockEvents = [
    {
        id: 'evt1',
        title: 'The Grand Wedding Gala',
        date: 'Oct 25, 2025',
        location: 'Mumbai Ballroom',
        code: 'GALA2025',
        photos: 124,
    },
    {
        id: 'evt2',
        title: 'Annual Corporate Summit',
        date: 'Nov 10, 2025',
        location: 'Pune Convention Center',
        code: 'SUMMIT99',
        photos: 42,
    },
    {
        id: 'evt3',
        title: 'New Year Bash 2026',
        date: 'Dec 31, 2025',
        location: 'Goa Beach Resort',
        code: 'NYEGOA',
        photos: 0,
    },
];

// Theme variables (using the cool professional theme)
const theme = {
    bg: 'bg-gray-900',
    card: 'bg-gray-800/70',
    accent: 'text-purple-400',
primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700/50',
};

// --- Sub-Components ---

// Component to simulate QR Code generation and copy functionality
const AccessCodeCard = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        // In a real application, you would use navigator.clipboard.writeText(code)
        // Since we are in an iFrame, we use the older execCommand method for compatibility.
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Could not copy text: ', err);
            setCopied(false);
        }
        document.body.removeChild(tempInput);
    }, [code]);

    return (
        <div className={`flex flex-col items-center p-6 ${theme.card} border ${theme.border} rounded-xl shadow-lg`}>
            <QrCode className={`w-12 h-12 mb-3 ${theme.accent}`} />
            <p className="text-sm font-semibold ${theme.textSecondary} mb-2">QR Code Access</p>
            <div className={`text-4xl font-mono font-bold tracking-wider p-3 rounded-lg ${theme.primary} ${theme.textPrimary}`}>
                {code}
            </div>
            <button
                onClick={handleCopy}
                className={`mt-4 flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.primary} ${theme.textPrimary} ${theme.primaryHover}`}
            >
                {copied ? (
                    <span className='flex items-center'>Copied! <CheckCircle className='w-4 h-4 ml-2' /></span>
                ) : (
                    <span className='flex items-center'>Copy Code <Clipboard className='w-4 h-4 ml-2' /></span>
                )}
            </button>
        </div>
    );
};

// Component for drag-and-drop photo upload
const PhotoUploadSection = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState({ message: 'Drag & drop photos or click to browse.', loading: false });
    const fileInputRef = React.useRef(null);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleFiles(files);
    }, []);

    const handleFileInputChange = useCallback((e) => {
        const files = e.target.files;
        handleFiles(files);
    }, []);

    const handleFiles = (files) => {
        if (files.length === 0) return;

        setStatus({ message: `Uploading ${files.length} file(s)...`, loading: true });

        // Simulate upload delay
        setTimeout(() => {
            setStatus({ message: `${files.length} photos uploaded successfully!`, loading: false });
            // Clear the input after successful submission
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }, 2500);
    };

    return (
        <div
            className={`p-6 md:p-10 text-center rounded-xl transition-all duration-300 cursor-pointer ${theme.card} border-2 border-dashed ${isDragging ? 'border-purple-400' : 'border-gray-600/50'} ${theme.textSecondary}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter} // Use DragEnter logic for DragOver too
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
            />
            <div className={`p-4 rounded-full inline-block mb-3 ${theme.primary} opacity-70`}>
                {status.loading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                ) : (
                    <Upload className="w-8 h-8 text-white" />
                )}
            </div>
            <p className={`text-lg font-semibold ${theme.textPrimary}`}>{status.message}</p>
            {!status.loading && (
                <p className="text-sm mt-1">Maximum 10MB per image. JPG, PNG, GIF allowed.</p>
            )}
            
        </div>
    );
};

// --- Main Component ---

const EventMediaHub = () => {
    const [selectedEventId, setSelectedEventId] = useState(mockEvents[0].id);

    const selectedEvent = mockEvents.find(e => e.id === selectedEventId);

    return (
        <div className={`min-h-screen ${theme.bg} p-6 md:p-10 font-roboto`}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap');
                    .font-poppins { font-family: 'Poppins', sans-serif; }
                    .font-roboto { font-family: 'Roboto', sans-serif; }
                `}
            </style>

            <div className="max-w-6xl mx-auto">
                {/* Title and User Greeting */}
                <h1 className="text-4xl font-poppins font-bold ${theme.accent} mb-2">Event Media Hub</h1>
                <p className="text-lg ${theme.textSecondary} mb-8">Hello, {mockUserData.userName}. Manage access codes and upload photos for your events.</p>

                {/* Event Selector and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Event Selector (Left Column - 1/3 width) */}
                    <div className="lg:col-span-1">
                        <h2 className={`text-2xl font-poppins font-semibold ${theme.textPrimary} mb-4`}>Select Event</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {mockEvents.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => setSelectedEventId(event.id)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                        selectedEventId === event.id 
                                            ? `${theme.primary} shadow-lg ${theme.textPrimary}`
                                            : `${theme.card} border ${theme.border} ${theme.textSecondary} hover:bg-gray-700/80`
                                    }`}
                                >
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <p className="text-sm flex items-center"><Calendar className='w-4 h-4 mr-2' /> {event.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Management (Right Columns - 2/3 width) */}
                    <div className="lg:col-span-2">
                        {selectedEvent && (
                            <div className='space-y-6'>
                                {/* Event Info Bar */}
                                <div className={`${theme.card} p-4 rounded-xl flex justify-between items-center ${theme.textSecondary} border ${theme.border}`}>
                                    <p className="flex items-center text-lg font-semibold ${theme.accent}">
                                        <MapPin className='w-5 h-5 mr-2' />
                                        {selectedEvent.location}
                                    </p>
                                    <p className="text-sm flex items-center font-medium">
                                        <Image className='w-4 h-4 mr-2' />
                                        {selectedEvent.photos} Photos Shared
                                    </p>
                                </div>

                                {/* QR Code and Upload Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* QR Code Card */}
                                    <AccessCodeCard code={selectedEvent.code} />

                                    {/* Share Button Placeholder */}
                                    <div className={`p-6 flex flex-col items-center justify-center ${theme.card} border ${theme.border} rounded-xl shadow-lg`}>
                                        <Share2 className={`w-12 h-12 mb-3 ${theme.accent}`} />
                                        <p className="text-sm font-semibold ${theme.textPrimary} mb-4">Share Access Link</p>
                                        <button className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.primary} ${theme.textPrimary} ${theme.primaryHover}`}>
                                            Generate & Share Link
                                        </button>
                                    </div>
                                </div>

                                {/* Upload Zone */}
                                <PhotoUploadSection />
                                
                                {/* Photo Gallery Preview Placeholder */}
                                <div className={`p-6 ${theme.card} border ${theme.border} rounded-xl shadow-lg`}>
                                    <h2 className="text-2xl font-poppins font-semibold ${theme.textPrimary} mb-4">Event Photo Gallery Preview</h2>
                                    <div className="h-48 flex items-center justify-center border border-gray-600 rounded-lg border-dashed">
                                        <p className="${theme.textSecondary} flex items-center">
                                            <AlertTriangle className='w-5 h-5 mr-2 text-yellow-500' />
                                            Gallery View Integration Coming Soon...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventMediaHub;
