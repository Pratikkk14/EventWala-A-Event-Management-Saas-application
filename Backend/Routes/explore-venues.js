const express = require("express");
const router = express.Router();

const {
    getAllVenues,
    getVenue,
    createVenue,
    updateVenue,
    deleteVenue,
} = require("../Controller/venue");
const authenticate = require("../Middleware/authentication");

// Get all venues, optionally filter by eventType
router.get("/", getAllVenues);

// // Get all venues by event type
// router.get("/by-type/:eventType", getAllVenues);

// Create a new venue
router.post("/", authenticate, createVenue);

// Update a venue by id
router.put("/:id", authenticate, updateVenue);

// Delete a venue by id
router.delete("/:id", authenticate, deleteVenue);

// Get a single venue by id
router.get("/:id", getVenue);

module.exports = router;
