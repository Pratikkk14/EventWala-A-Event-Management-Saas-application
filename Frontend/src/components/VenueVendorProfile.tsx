import React, { useState } from "react";

const VenueVendorProfile = () => {
  // This hardcoded data simulates what you would fetch from your backend API
  const venueAndVendorData = {
    venue: {
      name: "The Grand Ballroom",
      location: "Mumbai, India",
      description:
        "A luxurious and spacious venue perfect for large-scale events, from lavish weddings to corporate galas. Our elegant chandeliers, high ceilings, and customizable lighting create a magical atmosphere. We offer both indoor and outdoor spaces to suit any event size and style.",
      images: [
        "https://placehold.co/1200x600/1E1D2D/7F34C5?text=Grand+Ballroom+1",
        "https://placehold.co/1200x600/1E1D2D/7F34C5?text=Grand+Ballroom+2",
        "https://placehold.co/1200x600/1E1D2D/7F34C5?text=Grand+Ballroom+3",
      ],
      amenities: [
        "Air-Conditioned",
        "Wi-Fi",
        "Parking",
        "Sound System",
        "Projector",
      ],
      capacity: {
        min: 100,
        max: 1000,
      },
      price: "$10,000 - $25,000 per day",
    },
    vendor: {
      name: "EventWala Co.",
      profileImage: "https://i.pravatar.cc/150?u=vendor1",
      bio: "With over 15 years of experience in event management, EventWala Co. is your trusted partner for flawless event execution. We specialize in transforming your vision into reality, handling everything from venue setup to on-site coordination.",
      contact: {
        phone: "+91 98765 43210",
        email: "info@eventwala.com",
      },
      services: [
        "Event Planning & Coordination",
        "Venue Decoration & Setup",
        "Catering & Menu Design",
        "Photography & Videography",
        "Entertainment & DJ Services",
      ],
    },
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is where you would send the form data to your backend API
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
    setCurrentStep(1); // Reset to first step
  };

  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.eventType && formData.date && formData.guests;

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

  return (
    <div className="min-h-screen bg-[#151421] text-gray-200 font-sans">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=PT+Sans:wght@400;700&display=swap');
                
                body {
                    font-family: 'PT Sans', sans-serif;
                }
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                .card {
                    background-color: #1E1D2D;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
                }
                .btn-primary {
                    background-color: #7f34c5;
                    color: white;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    transition: background-color 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #6a2aab;
                }
                input, textarea {
                    background-color: #151421 !important;
                    border-color: #3f3e50 !important;
                    color: white !important;
                }
                input:focus, textarea:focus {
                    border-color: #7f34c5 !important;
                    box-shadow: 0 0 0 3px rgba(127, 52, 197, 0.5) !important;
                }
                .btn-disabled {
                    background-color: #3f3e50 !important;
                    cursor: not-allowed !important;
                    color: #9ca3af !important;
                }
                `}
      </style>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg overflow-hidden shadow-lg">
          {venueAndVendorData.venue.images.map((img, index) => (
            <div key={index} className="w-full h-64 overflow-hidden">
              <img
                src={img}
                alt={`${venueAndVendorData.venue.name} - ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Venue and Vendor Details Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Venue Details Card */}
          <div className="card p-6 md:col-span-2">
            <h1 className="text-3xl font-poppins font-bold text-gray-50">
              {venueAndVendorData.venue.name}
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              {venueAndVendorData.venue.location}
            </p>
            <p className="text-xl font-semibold text-[#7f34c5] mt-4">
              {venueAndVendorData.venue.price}
            </p>
            <p className="text-gray-300 mt-4 leading-relaxed">
              {venueAndVendorData.venue.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-poppins font-semibold text-gray-50">
                Key Amenities
              </h3>
              <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                {venueAndVendorData.venue.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <p className="mt-4 text-gray-300">
                **Capacity:** {venueAndVendorData.venue.capacity.min} -{" "}
                {venueAndVendorData.venue.capacity.max} guests
              </p>
            </div>
          </div>

          {/* Vendor Profile Card */}
          <div className="card p-6 flex flex-col items-center text-center">
            <img
              src={venueAndVendorData.vendor.profileImage}
              alt={`${venueAndVendorData.vendor.name} profile`}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#7f34c5]"
            />
            <h2 className="text-2xl font-poppins font-semibold text-gray-50 mt-4">
              {venueAndVendorData.vendor.name}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {venueAndVendorData.vendor.bio}
            </p>

            <div className="mt-6 w-full text-left">
              <h3 className="text-lg font-poppins font-semibold text-gray-50">
                Contact Details
              </h3>
              <p className="text-gray-300 mt-2">
                <span className="font-medium">Phone:</span>{" "}
                {venueAndVendorData.vendor.contact.phone}
              </p>
              <p className="text-gray-300 mt-1">
                <span className="font-medium">Email:</span>{" "}
                {venueAndVendorData.vendor.contact.email}
              </p>
            </div>

            <div className="mt-6 w-full text-left">
              <h3 className="text-lg font-poppins font-semibold text-gray-50">
                Services Offered
              </h3>
              <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                {venueAndVendorData.vendor.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
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
