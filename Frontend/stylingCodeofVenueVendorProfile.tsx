// ...existing imports and interfaces...

const VenueVendorProfile = () => {
  const [currentView, setCurrentView] = useState<'reviews' | 'offers'>('reviews');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  // ...other states...

  // ...fetch logic...

  // Group offers into sets of 3 for the slider
  const offersInGroupsOfThree = venue?.offers
    ? Array.from({ length: Math.ceil(venue.offers.length / 3) }, (_, i) =>
        venue.offers!.slice(i * 3, i * 3 + 3)
      )
    : [];

  // ...form logic...

  // Get current review and offer group
  const currentReview = venue?.vendorReview?.[currentReviewIndex] || null;
  const currentOfferGroup = offersInGroupsOfThree[currentOfferIndex] || [];

  // ...helper functions...

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
              {venue?.venuePrices?.length ? `₹${venue.venuePrices[0].price}` : "N/A"}
            </p>
            <p className="text-gray-300 mt-4 leading-relaxed">{venue?.description}</p>
            <div className="mt-6">
              <h3 className="text-xl font-poppins font-semibold text-gray-50">Key Amenities</h3>
              <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                {venue?.amenities?.map((amenity, idx) => <li key={idx}>{amenity}</li>)}
              </ul>
              <p className="mt-4 text-gray-300">**Capacity:** {venue?.capacity ?? "-"} guests</p>
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
                        <span className="font-bold">{currentReview?.user || "User"}</span>
                        <span className="ml-2">Rating: {currentReview?.rating}</span>
                        <div>{currentReview?.comment}</div>
                        <div className="text-xs text-gray-500">
                          {currentReview?.createdAt ? new Date(currentReview.createdAt).toLocaleDateString() : ""}
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
        {/* ...keep your booking form as is... */}
      </div>
      {/* ...message box as is... */}
    </div>
  );
};

export default VenueVendorProfile;