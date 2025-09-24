import React, { useState, useEffect } from "react";
import { EventTypeContext } from "../context/EventTypeContext";
// import ImageSlider from "./ImageSlider";
import { useParams } from "react-router-dom";



// TypeScript interfaces for Venue and Vendor
interface Review {
  user: { name?: string } | string;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Offer {
  _id?: string;
  title: string;
  description: string;
  expires?: string;
}

interface Venue {
  name: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  description?: string;
  photos?: Array<{ url?: string; fileId?: string }>;
  capacity?: number;
  amenities?: string[];
  venuePrices?: Array<{ eventType: string; price: number }>;
  vendorReview?: Review[];
  offers?: Offer[];
}

interface Vendor {
  businessName?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  vendorDescription?: string;
  // logoUrl?: string;
}

const VenueVendorProfile = () => {
  // Removed unused currentView and setCurrentView
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
        setVenue(venueData);
        // Fetch vendor if not populated
        if (venueData.vendor && typeof venueData.vendor === "string") {
          const vRes = await fetch(`/api/vendors/${venueData.vendor}`);
          if (!vRes.ok) throw new Error("Failed to fetch vendor");
          const vendorData = await vRes.json();
          setVendor(vendorData);
        } else {
          setVendor(venueData.vendor);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Venue Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{venue?.name}</h1>
          <div className="text-lg text-gray-400 mb-1">{getLocationString()}</div>
          <div className="mb-2">{venue?.description}</div>
          {/* Venue Images */}
          <div className="flex gap-2 mb-2">
            {venue?.photos?.map((img: { url?: string; fileId?: string }, i: number) => (
              <img key={i} src={img.url || img.fileId || ""} alt="Venue" className="w-32 h-20 object-cover rounded" />
            ))}
          </div>
          <div className="mb-1">Capacity: {venue?.capacity || "-"}</div>
          <div className="mb-1">Amenities: {venue?.amenities?.join(", ")}</div>
          <div className="mb-1">Price for {eventType}: {getPriceForEventType() ? `₹${getPriceForEventType()}` : "N/A"}</div>
        </div>

        {/* Vendor Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-1">Vendor</h2>
          <div className="flex items-center gap-4 mb-2">
            {/* Vendor image (url string) */}
            {/* <img src={vendor?.logoUrl || ""} alt="Vendor Logo" className="w-16 h-16 rounded-full object-cover" /> */}
            <div>
              <div className="font-bold">{vendor?.businessName}</div>
              <div className="text-gray-400">Contact: {vendor?.contactPerson}</div>
              <div className="text-gray-400">Email: {vendor?.email}</div>
              <div className="text-gray-400">Phone: {vendor?.phoneNumber}</div>
            </div>
          </div>
          <div className="mb-1">{vendor?.vendorDescription}</div>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
          {venue?.vendorReview?.length ? (
            <div>
              <div className="mb-2">
                <span className="font-bold">{
                  typeof currentReview?.user === "string"
                    ? currentReview.user
                    : currentReview?.user?.name || "User"
                }</span> -
                <span className="ml-2">Rating: {currentReview?.rating}</span>
                <div>{currentReview?.comment}</div>
                <div className="text-xs text-gray-500">{currentReview?.createdAt ? new Date(currentReview.createdAt).toLocaleDateString() : ""}</div>
              </div>
              <button onClick={handlePreviousReview} className="mr-2 px-2 py-1 bg-gray-700 rounded">Previous</button>
              <button onClick={handleNextReview} className="px-2 py-1 bg-gray-700 rounded">Next</button>
            </div>
          ) : (
            <div>No reviews yet.</div>
          )}
        </div>

        {/* Offers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Offers</h2>
          {venue?.offers?.length ? (
            <div>
              <div className="flex gap-4">
                {currentOfferGroup.map((offer: Offer, i: number) => (
                  <div key={offer._id || i} className="bg-gray-800 p-4 rounded w-64">
                    <div className="font-bold mb-1">{offer.title}</div>
                    <div className="mb-1">{offer.description}</div>
                    <div className="text-xs text-gray-400">Expires: {offer.expires ? new Date(offer.expires).toLocaleDateString() : "-"}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button onClick={handlePreviousOffer} className="mr-2 px-2 py-1 bg-gray-700 rounded">Previous</button>
                <button onClick={handleNextOffer} className="px-2 py-1 bg-gray-700 rounded">Next</button>
              </div>
            </div>
          ) : (
            <div>No offers available.</div>
          )}
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