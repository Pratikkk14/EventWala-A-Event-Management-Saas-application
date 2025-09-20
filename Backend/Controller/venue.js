const Venue = require("../Models/venue");

// Get all venues, optionally filter by eventType
const getAllVenues = async (req, res) => {
    try {
        const { eventTypes } = req.query;
        let query = {};
        if (eventTypes) {
            query.eventTypes = eventTypes;
        }
        const venues = await Venue.find(query).populate("vendor");
        res.json({ success: true, venues });
    } catch (error) {
        console.error("[getAllVenues] Error:", error);
        res.status(500).json({ success: false, message: "Error in getAllVenues: " + error.message });
    }
};

// Get a single venue by _id
const getVenue = async (req, res) => {
    try {
        const { _id } = req.params; 
        const venue = await Venue.findById(_id).populate("vendor");
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

// Update a venue by _id
const updateVenue = async (req, res) => {
    try {
        const { _id } = req.params;
        const venue = await Venue.findByIdAndUpdate(_id, req.body, { new: true });
        if (!venue) {
            return res.status(404).json({ success: false, message: "Venue not found" });
        }
        res.json({ success: true, venue });
    } catch (error) {
        console.error("[updateVenue] Error:", error);
        res.status(500).json({ success: false, message: "Error in updateVenue: " + error.message });
    }
};

// Delete a venue by _id
const deleteVenue = async (req, res) => {
    try {
        const { _id } = req.params;
        const venue = await Venue.findByIdAndDelete(_id);
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
};
