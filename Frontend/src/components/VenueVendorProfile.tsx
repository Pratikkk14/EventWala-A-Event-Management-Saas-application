import React, { useState, useEffect } from "react";
import { EventTypeContext } from "../context/EventTypeContext";
import { useInquiry } from "../context/InquiryContext";
// import ImageSlider from "./ImageSlider";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Offer {
  _id?: string;
  title: string;
  description?: string;
  discountPercentage?: number;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
}

interface VenuePrice {
  eventType:
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
  price: number;
}

interface Address {
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  city?: string;
  pincode?: string;
  state?: string;
  country?: string;
}

interface VendorReview {
  user?: string; // ObjectId string
  rating: number;
  comment?: string;
  createdAt?: string;
  reviewerName?: string; // Added for backend compatibility
  date?: string; // Added for backend compatibility
}

interface VenuePhoto {
  fileId?: string;
  url?: string;
  fileName?: string;
  uploadedAt?: string;
  _id?: string;
}

interface Venue {
  name: string;
  address?: Address;
  photo?: VenuePhoto[];
  photos?: VenuePhoto[]; // For backward compatibility
  vendor?: Vendor;
  vendorReview?: VendorReview[];
  venuePrices?: VenuePrice[];
  capacity?: number;
  amenities?: string[];
  eventTypes?: VenuePrice["eventType"][];
  offers?: Offer[];
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

interface Vendor {
  uid?: string;
  email?: string;
  businessName?: string;
  contactPerson?: string;
  vendorDescription?: string;
  phoneNumber?: string;
  website?: string;
  logoUrl?: string;
  venues?: string[];
  services?: string[];
  isVerified?: boolean;
  accountStatus?: "active" | "suspended" | "deactivated";
  createdAt?: string;
  updatedAt?: string;
}

const VenueVendorProfile = () => {
  const [currentView, setCurrentView] = useState<'reviews' | 'offers'>('reviews');
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState<number>(0);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const { eventType } = React.useContext(EventTypeContext);
  const { venueId } = useParams<{ venueId: string }>();

  // Fetch venue and vendor data dynamically
  useEffect(() => {
    const fetchVenueAndVendor = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch venue by ID, populate vendor
        console.log("Fetching venue data for ID:", venueId);
        const res = await fetch(`/api/explore-venues/${venueId}`);
        if (!res.ok) {
          console.error("API response not OK:", res.status, res.statusText);
          throw new Error(`Failed to fetch venue: ${res.status} ${res.statusText}`);
        }
        
        const venueData = await res.json();
        
        // Enhanced logging for debugging
        console.log("API Response:", venueData);
        console.log("Venue data:", venueData.venue);
        console.log("Photos field (venue.photo):", venueData.venue.photo);
        console.log("Photos field (venue.photos):", venueData.venue.photos);
        
        // Check if we have image data in the expected format
        const photoArray = venueData.venue.photo || venueData.venue.photos;
        if (!photoArray || !Array.isArray(photoArray)) {
          console.warn("No photo array found or it's not an array:", photoArray);
          
          // If we have photo data but it's not in the right format, try to normalize it
          if (venueData.venue.photo && !Array.isArray(venueData.venue.photo)) {
            console.log("Attempting to normalize non-array photo field");
            venueData.venue.photo = [venueData.venue.photo]; 
          }
        } else {
          console.log("Photo array length:", photoArray.length);
          console.log("First photo:", photoArray[0]);
        }
        
        // Normalize data structure before setting to state
        const normalizedVenue = {
          ...venueData.venue,
          // Ensure we have a consistent photos field
          photo: venueData.venue.photo || []
        };
        
        setVenue(normalizedVenue);
        setVendor(venueData.venue.vendor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (venueId) fetchVenueAndVendor();
  }, [venueId]);

  // Group offers into sets of 3 for the slider
  const offersInGroupsOfThree = venue?.offers
    ? Array.from({ length: Math.ceil(venue.offers.length / 3) }, (_, i) =>
        venue.offers!.slice(i * 3, i * 3 + 3)
      )
    : [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    guests: "",
    details: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    date: string;
    guests: string;
    details: string;
  }

  interface ChangeEventTarget {
    name: keyof BookingFormData;
    value: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as ChangeEventTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const { addInquiry } = useInquiry();
  
  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    console.log("VenueVendorProfile: Booking request submitted:", formData);
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.eventType || !formData.date) {
      console.log("VenueVendorProfile: Form validation failed - missing required fields");
      setMessage("Please fill all required fields");
      return;
    }
    
    try {
      // Create an inquiry from the form data
      if (venue) {
        // Debug inquiry context
        console.log("VenueVendorProfile: addInquiry function available:", !!addInquiry);
        
        // Create the inquiry object to be submitted
        const inquiryData = {
          client: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          event: {
            type: formData.eventType || "Event",
            name: `${formData.name}'s ${formData.eventType || "Event"}`,
            date: formData.date,
            guests: parseInt(formData.guests, 10) || 0,
            details: formData.details
          },
          budget: (() => {
            const price = venue.venuePrices?.find(p => p.eventType === formData.eventType)?.price;
            if (price) {
              return `$${price}`;
            } else {
              console.log("No price found for event type:", formData.eventType);
              return 'Contact for pricing';
            }
          })(),
          venueId: venueId,
          venueName: venue.name,
          eventStatus: 'Pending' as const
        };
        
        console.log("VenueVendorProfile: About to add inquiry:", inquiryData);
        
        // Call the context function to add the inquiry
        addInquiry(inquiryData);
        console.log("VenueVendorProfile: Inquiry added successfully");
        
        // Create a corresponding event with "Pending" status in the backend
        try {
          // Prepare event data for API
          const eventData = {
            user: user?.uid,
            name: inquiryData.event.name,
            type: inquiryData.event.type,
            date: inquiryData.event.date,
            description: inquiryData.event.details || '',
            host: {
              name: inquiryData.client.name,
              email: inquiryData.client.email,
              phone: inquiryData.client.phone
            },
            venue: venueId,
            venueName: venue.name,
            budget: inquiryData.budget,
            guests: inquiryData.event.guests,
            eventStatus: "Pending"
          };
          
          console.log("VenueVendorProfile: Creating event in backend:", eventData);
          
          // Send to backend API
          const response = await fetch('/api/explore-events', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + (await user.getIdToken()),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
          });
          
          const result = await response.json();
          console.log("Backend response:", result);
          
          if (result.success) {
            console.log(`Event created successfully with ID: ${result._id}`);
            // Store the backend event ID in the inquiry data
            inquiryData.backendEventId = result._id;
            
            // We already added the inquiry above, but we'll add the eventId to it in context
            // by updating the inquiries array
            addInquiry({...inquiryData});
          } else {
            console.error("Failed to create event in backend:", result.message);
          }
        } catch (error) {
          console.error("Failed to create event in backend:", error);
          // Continue anyway - the inquiry is saved locally
        }
        
        // Check localStorage to confirm it was saved
        setTimeout(() => {
          const storedInquiries = localStorage.getItem('inquiries');
          console.log("VenueVendorProfile: Verification - LocalStorage inquiries:", storedInquiries);
        }, 100);
        
        setMessage(
          "Your booking request has been submitted! We will get in touch with you shortly."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          date: "",
          guests: "",
          details: "",
        });
        setCurrentStep(1);
      } else {
        console.error("VenueVendorProfile: Venue is null, cannot submit form");
      }
    } catch (error) {
      console.error("VenueVendorProfile: Error submitting booking request:", error);
      setMessage("Error submitting your request. Please try again.");
    }
  };

  const isStep1Valid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";
  const isStep2Valid = formData.eventType.trim() !== "" && formData.date.trim() !== "" && formData.guests.trim() !== "" && Number(formData.guests) > 0;


  const handleNextReview = () => {
    if (!venue?.vendorReview?.length) return;
    setCurrentReviewIndex(
      (prevIndex) => (prevIndex + 1) % (venue.vendorReview ? venue.vendorReview.length : 1)
    );
  };

  const handlePreviousReview = () => {
    if (!venue?.vendorReview?.length) return;
    setCurrentReviewIndex(
      (prevIndex) =>
        (prevIndex - 1 + (venue.vendorReview ? venue.vendorReview.length : 1)) %
        (venue.vendorReview ? venue.vendorReview.length : 1)
    );
  };

  const handleNextOffer = () => {
    setCurrentOfferIndex(
      (prevIndex) => (prevIndex + 1) % offersInGroupsOfThree.length
    );
  };

  const handlePreviousOffer = () => {
    setCurrentOfferIndex(
      (prevIndex) =>
        (prevIndex - 1 + offersInGroupsOfThree.length) %
        offersInGroupsOfThree.length
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Event Type
              </label>
              <input
                type="text"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
                min="1"
                required
                pattern="[1-9][0-9]*"
                inputMode="numeric"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300">
                Additional Details / Requirements
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[#7f34c5] focus:ring-[#7f34c5]"
              ></textarea>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Get current review and offer group
  const currentReview = venue?.vendorReview?.[currentReviewIndex] || null;
  const currentOfferGroup = offersInGroupsOfThree[currentOfferIndex] || [];

  // Helper: get price for current eventType
  const getPriceForEventType = () => {
    if (!venue?.venuePrices) return null;
    
    // Use selected event type or default to first available event type
    const selectedEventType = eventType || (venue.eventTypes && venue.eventTypes.length > 0 ? venue.eventTypes[0] : null);
    if (!selectedEventType) return null;
    
    const priceObj = venue.venuePrices.find((p) => p.eventType === selectedEventType);
    if (priceObj) {
      return priceObj.price;
    } else {
      console.log(`No price found for event type: ${selectedEventType}`);
      return venue.venuePrices.length > 0 ? venue.venuePrices[0].price : null;
    }
  };

  // Helper: get location string (see EventsPage.jsx for format)
  const getLocationString = () => {
    if (!venue?.address) return "";
    const { addressLine1, addressLine2, street, city, state, country, pincode } = venue.address;
    return [addressLine1, addressLine2, street, city, state, country, pincode]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151421] text-gray-200">
        <div className="text-center">
          <div className="mb-4 text-2xl">Loading venue data...</div>
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#7f34c5] animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151421] text-red-400">
        <div className="text-center max-w-lg px-4">
          <h2 className="text-2xl font-bold mb-4">Error Loading Venue</h2>
          <p className="mb-4">{error}</p>
          <p className="text-gray-400 text-sm">Please check the venue ID or try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-[#7f34c5] text-white rounded-md hover:bg-[#6a2aab]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151421] text-yellow-400">
        <div className="text-center max-w-lg px-4">
          <h2 className="text-2xl font-bold mb-4">Venue Not Found</h2>
          <p className="text-gray-400 text-sm">
            The requested venue could not be found or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151421] text-gray-200 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=PT+Sans:wght@400;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          .card { background-color: #1E1D2D; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.12); }
          .btn-primary { background-color: #7f34c5; color: white; font-weight: 600; border-radius: 0.5rem; padding: 0.75rem 1.5rem; }
          .btn-primary:hover { background-color: #6a2aab; }
          .btn-disabled { background-color: #3f3e50 !important; cursor: not-allowed !important; color: #9ca3af !important; }
        `}
      </style>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg overflow-hidden shadow-lg">
          {(() => {
            // Debug the image data structure
            const photos = venue?.photos || venue?.photo || [];
            console.log("Venue image data:", { venue, photos });
            
            if (!photos || photos.length === 0) {
              return (
                <div className="w-full h-64 overflow-hidden col-span-3 flex items-center justify-center bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No images available for this venue</p>
                </div>
              );
            }
            
            return photos.map((img, idx) => {
              console.log(`Image ${idx}:`, img);
              const imgUrl = img?.url || img?.fileId || "";
              
              return (
                <div key={idx} className="w-full h-64 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <div className="text-white text-sm bg-black bg-opacity-50 py-1 px-3 rounded-full">
                      {idx + 1} of {photos.length}
                    </div>
                  </div>
                  
                  {!imgUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                      <p className="text-gray-400">No image URL</p>
                    </div>
                  ) : (
                    <img 
                      src={imgUrl} 
                      alt={`${venue?.name || 'Venue'} - Image ${idx + 1}`} 
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" 
                      onLoad={() => console.log(`Image ${idx} loaded successfully`)}
                      onError={(e) => {
                        console.error("Error loading image:", { img, idx, imgUrl });
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                      }}
                    />
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* Venue and Vendor Details Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Venue Details Card */}
          <div className="card p-6 md:col-span-2">
            <h1 className="text-3xl font-poppins font-bold text-gray-50">{venue?.name || "Unnamed Venue"}</h1>
            <p className="text-lg text-gray-400 mt-2">{getLocationString() || "Location not specified"}</p>
            <p className="text-xl font-semibold text-[#7f34c5] mt-4">
              {getPriceForEventType() ? `₹${getPriceForEventType()}` : venue?.venuePrices?.length ? `₹${venue.venuePrices[0].price}` : "N/A"}
            </p>
            <p className="text-gray-300 mt-4 leading-relaxed">{venue?.description}</p>
            <div className="mt-6">
              <h3 className="text-xl font-poppins font-semibold text-gray-50">Key Amenities</h3>
              <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                {venue?.amenities?.map((amenity, idx) => <li key={idx}>{amenity}</li>)}
              </ul>
              <p className="mt-4 text-gray-300">Capacity: {venue?.capacity ?? "-"} guests</p>
            </div>
          </div>

          {/* Vendor & Offers Tabs */}
          <div className="card p-6 md:col-span-1">
            <div className="flex justify-around mb-4 border-b border-gray-600">
              <button
                onClick={() => setCurrentView('reviews')}
                className={`text-lg font-semibold py-2 px-4 border-b-2 ${currentView === 'reviews' ? 'border-[#7f34c5] text-[#7f34c5]' : 'border-transparent text-gray-400'}`}
              >
                Vendor & Reviews
              </button>
              <button
                onClick={() => setCurrentView('offers')}
                className={`text-lg font-semibold py-2 px-4 border-b-2 ${currentView === 'offers' ? 'border-[#7f34c5] text-[#7f34c5]' : 'border-transparent text-gray-400'}`}
              >
                Offers
              </button>
            </div>
            {currentView === 'reviews' ? (
              <>
                <div className="flex flex-col items-center text-center">
                  {/* <img src={vendor?.logoUrl || ""} alt="Vendor Logo" className="w-24 h-24 rounded-full object-cover border-4 border-[#7f34c5]" /> */}
                  <h2 className="text-2xl font-poppins font-semibold text-gray-50 mt-4">{vendor?.businessName}</h2>
                  <p className="text-sm text-gray-400 mt-1">{vendor?.vendorDescription}</p>
                  <div className="mt-6 w-full text-left">
                    <h3 className="text-lg font-poppins font-semibold text-gray-50">Contact</h3>
                    <div className="text-gray-300">Email: {vendor?.email}</div>
                    <div className="text-gray-300">Phone: {vendor?.phoneNumber}</div>
                  </div>
                </div>
                <div className="mt-6 w-full text-left">
                  <h3 className="text-lg font-poppins font-semibold text-gray-50 mb-2">Customer Reviews</h3>
                  {venue?.vendorReview?.length ? (
                    <div>
                      <div className="mb-2">
                        <span className="font-bold">
                          {currentReview?.reviewerName || currentReview?.user || "User"}
                        </span>
                        <span className="ml-2">Rating: {currentReview?.rating}</span>
                        <div>{currentReview?.comment}</div>
                        <div className="text-xs text-gray-500">
                          {currentReview?.date ? new Date(currentReview.date).toLocaleDateString() : 
                          currentReview?.createdAt ? new Date(currentReview.createdAt).toLocaleDateString() : ""}
                        </div>
                      </div>
                      <button onClick={handlePreviousReview} className="mr-2 px-2 py-1 bg-gray-700 rounded">Previous</button>
                      <button onClick={handleNextReview} className="px-2 py-1 bg-gray-700 rounded">Next</button>
                    </div>
                  ) : (
                    <div>No reviews yet.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4">
                <h3 className="text-lg font-poppins font-semibold text-gray-50 mb-2">Exclusive Offers</h3>
                <div className="flex gap-4">
                  {currentOfferGroup.map((offer, i) => (
                    <div key={offer._id || i} className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-[#7f34c5]">{offer.title}</h4>
                      <p className="text-sm text-gray-300 mt-1">{offer.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Expires: {offer.validTo ? new Date(offer.validTo).toLocaleDateString() : "-"}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button onClick={handlePreviousOffer} className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 mr-2">&lt;</button>
                  {offersInGroupsOfThree.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentOfferIndex(idx)}
                      className={`w-2 h-2 mx-1 rounded-full ${idx === currentOfferIndex ? 'bg-[#7f34c5]' : 'bg-gray-600'}`}
                    ></button>
                  ))}
                  <button onClick={handleNextOffer} className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 ml-2">&gt;</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="mt-12 card p-8">
          <h2 className="text-2xl font-poppins font-bold text-gray-50 text-center">
            Book This Venue
          </h2>
          <p className="text-center text-gray-400 mt-2 mb-6">
            Step {currentStep} of {totalSteps}
          </p>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-300 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`ml-auto btn-primary ${
                    currentStep === 1
                      ? !isStep1Valid && "btn-disabled"
                      : !isStep2Valid && "btn-disabled"
                  }`}
                  disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                >
                  Next
                </button>
              ) : (
                <button type="submit" className="ml-auto btn-primary">
                  Send Booking Request
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Message Box */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1E1D2D] p-8 rounded-lg shadow-xl max-w-sm text-center">
            <p className="text-lg text-white font-medium">{message}</p>
            <button
              onClick={() => setMessage(null)}
              className="mt-6 px-4 py-2 bg-[#7f34c5] text-white rounded-md hover:bg-[#6a2aab]"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Debug section - add test inquiry */}
      <div className="mt-8 p-4 bg-red-800 bg-opacity-20 rounded-lg max-w-sm mx-auto">
        <h3 className="text-white font-bold mb-2">Debug Tools</h3>
        <button
          onClick={() => {
            // Create a test inquiry
            if (venue) {
              const testInquiry = {
                client: {
                  name: "Test User",
                  email: "test@example.com",
                  phone: "555-1234"
                },
                event: {
                  type: "Test Event",
                  name: "Test Event Name",
                  date: new Date().toISOString().split('T')[0],
                  guests: 50,
                  details: "This is a test inquiry created from debug button"
                },
                budget: "$1000",
                venueId: venueId,
                venueName: venue.name,
                eventStatus: 'Pending' as const
              };
              
              console.log("TEST: Creating test inquiry:", testInquiry);
              addInquiry(testInquiry);
              console.log("TEST: Test inquiry created");
              
              // Debug localStorage
              setTimeout(() => {
                console.log("TEST: Verifying localStorage after test inquiry");
                const storedInquiries = localStorage.getItem('inquiries');
                console.log("TEST: StoredInquiries:", storedInquiries);
              }, 100);
              
              setMessage("Test inquiry created! Check console for details");
            }
          }}
          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
        >
          Create Test Inquiry
        </button>
      </div>
    </div>
  );
};

export default VenueVendorProfile;
