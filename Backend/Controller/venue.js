const Venue = require("../Models/venue");
const Vendor = require("../Models/vendor");

// Get all venues, optionally filter by eventType
const getAllVenues = async (req, res) => {
    try {
        // Support filtering by eventTypes (query) or eventType (param)
        let eventTypes = req.query.eventTypes;
        if (!eventTypes && req.params.eventType) {
            eventTypes = req.params.eventType;
        }
        let query = {};
        if (eventTypes) {
            query.eventTypes = {$in : [eventTypes]};
        }
        const venues = await Venue.find(query).populate("vendor");
        res.json({ success: true, venues });
    } catch (error) {
        console.error("[getAllVenues] Error:", error);
        res.status(500).json({ success: false, message: "Error in getAllVenues: " + error.message });
    }
};


const getAllVenuesByFilter = async (req, res) => { 
    try {
    let lat, lng;

    if (req.query.pincode) {
      const decodedPin = Buffer.from(req.query.pincode, "base64").toString("utf8");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${decodedPin}&countrycodes=in&format=json&limit=1`,
        { headers: { "User-Agent": "NearbyLocator/1.0 (contact@example.com)" } }
      );

      const data = await response.json();
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "PIN code not found" });
      }

      lat = parseFloat(data[0].lat);
      lng = parseFloat(data[0].lon);
    } else if (req.query.lat && req.query.lng) {
      lat = parseFloat(req.query.lat);
      lng = parseFloat(req.query.lng);
    } else {
      return res.status(400).json({ message: "Either location or pin code required" });
    }

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const radius = parseInt(req.query.radius) || 3000;

    // Query Venue model for nearby venues
    const venues = await Venue.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      },
    });

     // Format response for frontend
    const locations = venues.map(v => ({
      name: v.name,
      addressLine1: v.address?.addressLine1 ?? "",
      addressLine2: v.address?.addressLine2 ?? "",
      pincode: v.address?.pincode ?? "",
      city: v.address?.city ?? "",
      position: v.location?.coordinates
        ? [v.location.coordinates[1], v.location.coordinates[0]] // [lng, lat] as mongo wants reverse order to process data
        : [0, 0],
      image: v.photos?.[0]?.fileId ?? "",
        id: v._id,
    }));
        
    if (locations.length === 0) {
      return res.status(404).json({ message: "No nearby venues found", baseLocation: { lat, lng } });
    }

    res.json({ baseLocation: { lat, lng }, locations });
  } catch (err) {
    console.error("Error fetching nearby venues:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Get a single venue by id
const getVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await Venue.findById(id).populate("vendor");

        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json({ success: true, venue });
    } catch (error) {
        console.error("[getVenue] Error:", error);
        res.status(500).json({ success: false, message: "Error in getVenue: " + error.message });
    }
};

// Create a new venue
const createVenue = async (req, res) => {
    try {
        const venue = new Venue(req.body);
        await venue.save();
        res.status(201).json({ success: true, venue });
    } catch (error) {
        console.error("[createVenue] Error:", error);
        res.status(500).json({ success: false, message: "Error in createVenue: " + error.message });
    }
};

// Update a venue by id
const updateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await Venue.findByIdAndUpdate(id, req.body, { new: true });
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json({ success: true, venue });
    } catch (error) {
        console.error("[updateVenue] Error:", error);
        res.status(500).json({ success: false, message: "Error in updateVenue: " + error.message });
    }
};

// Delete a venue by id
const deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await Venue.findByIdAndDelete(id);
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json({ success: true, message: "Venue deleted" });
    } catch (error) {
        console.error("[deleteVenue] Error:", error);
        res.status(500).json({ success: false, message: "Error in deleteVenue: " + error.message });
    }
};

module.exports = {
    getAllVenues,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue,
    getAllVenuesByFilter,
};
