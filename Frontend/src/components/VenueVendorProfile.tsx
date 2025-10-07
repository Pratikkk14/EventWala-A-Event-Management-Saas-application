import React, { useState, useEffect } from "react";
import { EventTypeContext } from "../context/EventTypeContext";
// import ImageSlider from "./ImageSlider";
import { useParams } from "react-router-dom";

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

interface Venue {
  name: string;
  address?: Address;
  photos?: Array<{ fileId?: string; url?: string }>;
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

  const { eventType } = React.useContext(EventTypeContext);
  const { venueId } = useParams<{ venueId: string }>();

  // Fetch venue and vendor data dynamically
  useEffect(() => {
    const fetchVenueAndVendor = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch venue by ID, populate vendor
        const res = await fetch(`/api/explore-venues/${venueId}`);
        if (!res.ok) throw new Error("Failed to fetch venue");
        const venueData = await res.json();
        setVenue(venueData.venue);
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

  const handleSubmit = (e: HandleSubmitEvent) => {
    e.preventDefault();
    console.log("Booking request submitted:", formData);
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
  };

  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.eventType && formData.date && formData.guests;


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
    if (!venue?.venuePrices || !eventType) return null;
    const priceObj = venue.venuePrices.find((p) => p.eventType === eventType);
    return priceObj ? priceObj.price : null;
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
    return <div className="min-h-screen flex items-center justify-center bg-[#151421] text-gray-200">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#151421] text-red-400">{error}</div>;
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
          {venue?.photos?.map((img, idx) => (
            <div key={idx} className="w-full h-64 overflow-hidden">
              <img src={img.url || img.fileId || ""} alt={`Venue ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>

        {/* Venue and Vendor Details Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Venue Details Card */}
          <div className="card p-6 md:col-span-2">
            <h1 className="text-3xl font-poppins font-bold text-gray-50">{venue?.name}</h1>
            <p className="text-lg text-gray-400 mt-2">{getLocationString()}</p>
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
    </div>
  );
};

export default VenueVendorProfile;
