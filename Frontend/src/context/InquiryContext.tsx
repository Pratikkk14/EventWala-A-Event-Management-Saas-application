import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToLocalStorage, loadFromLocalStorage, debugLocalStorage } from '../utils/localStorage';

// Define the Inquiry interface (same as in Inquiry.tsx)
export interface Inquiry {
    id: number;
    client: {
        name: string;
        email: string;
        phone: string;
    };
    event: {
        type: string;
        name: string;
        date: string; 
        guests: number;
        details?: string;
    };
    budget: string;
    venueId?: string;
    venueName: string;
    eventStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    timeAdded: Date;
    backendEventId?: string; // MongoDB ID of the event in the backend
}

interface InquiryContextType {
    inquiries: Inquiry[];
    addInquiry: (inquiry: Omit<Inquiry, 'id' | 'timeAdded'>) => void;
    updateInquiryStatus: (id: number, status: Inquiry['eventStatus']) => void;
    removeInquiry: (id: number) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

let nextId = 200; // Start IDs from 200 to avoid conflicts with the mock data

export const InquiryProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // Load inquiries from localStorage on mount
    useEffect(() => {
        console.log("InquiryContext: Initializing and loading from localStorage");
        
        // Debug all localStorage contents
        debugLocalStorage();
        
        // Load inquiries with our helper function
        const loadedInquiries = loadFromLocalStorage<any[]>('inquiries', []);
        console.log("InquiryContext: Loaded inquiries from localStorage:", loadedInquiries);
        
        if (loadedInquiries.length > 0) {
            try {
                // Convert string dates back to Date objects
                const processedInquiries = loadedInquiries.map((inquiry: any) => ({
                    ...inquiry,
                    timeAdded: new Date(inquiry.timeAdded)
                }));
                
                setInquiries(processedInquiries);
                console.log("InquiryContext: Processed inquiries:", processedInquiries);
                
                // Update the nextId to be higher than any existing ID
                const maxId = Math.max(...processedInquiries.map((i: Inquiry) => i.id), 200);
                nextId = maxId + 1;
                console.log("InquiryContext: Next ID set to:", nextId);
            } catch (e) {
                console.error("Failed to process inquiries:", e);
                // Reset localStorage in case of corrupted data
                saveToLocalStorage('inquiries', []);
            }
        } else {
            console.log("InquiryContext: No inquiries found in localStorage");
        }
    }, []);

    // Save inquiries to localStorage whenever they change
    useEffect(() => {
        console.log("InquiryContext: Saving inquiries to localStorage:", inquiries);
        saveToLocalStorage('inquiries', inquiries);
        // Debug after saving
        setTimeout(debugLocalStorage, 100);
    }, [inquiries]);

    const addInquiry = (inquiryData: Omit<Inquiry, 'id' | 'timeAdded'>) => {
        console.log("InquiryContext: Adding new inquiry:", inquiryData);
        const newInquiry: Inquiry = {
            ...inquiryData,
            id: nextId++,
            timeAdded: new Date()
        };
        console.log("InquiryContext: Created inquiry with ID:", newInquiry.id);
        setInquiries(prev => {
            const updated = [...prev, newInquiry];
            console.log("InquiryContext: Updated inquiries list:", updated);
            return updated;
        });
    };

    const updateInquiryStatus = (id: number, status: Inquiry['eventStatus']) => {
        setInquiries(prev => 
            prev.map(inquiry => 
                inquiry.id === id ? { ...inquiry, eventStatus: status } : inquiry
            )
        );
    };

    const removeInquiry = (id: number) => {
        setInquiries(prev => prev.filter(inquiry => inquiry.id !== id));
    };

    const value = {
        inquiries,
        addInquiry,
        updateInquiryStatus,
        removeInquiry
    };

    return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>;
};

export const useInquiry = () => {
    const context = useContext(InquiryContext);
    if (context === undefined) {
        throw new Error('useInquiry must be used within an InquiryProvider');
    }
    return context;
};