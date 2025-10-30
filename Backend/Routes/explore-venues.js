const express = require("express");
const router = express.Router();

const {
    getAllVendorVenues,
    getAllVenues,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue,
    getAllVenuesByFilter,
} = require("../Controller/venue");
const authenticate = require("../Middleware/authentication");

// Get all venues, optionally filter by eventType
router.get("/", getAllVenues);

router.get("/venues-by-vendor/:vendorId", getAllVendorVenues);

// Get all venues by a types of filter like pincode, latitude, longitude
router.get("/all-events", getAllVenuesByFilter);


// Create a new venue
router.post("/", authenticate, createVenue);

// Update a venue by id
router.put("/:id", authenticate, updateVenue);

// Delete a venue by id
router.delete("/:id", authenticate, deleteVenue);

// Get a single venue by id
router.get("/:id", getVenue);

module.exports = router;
