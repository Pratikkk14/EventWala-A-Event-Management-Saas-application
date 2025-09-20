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

// Get all venues, 
router.get("/", getAllVenues);

// Get all venues by event type
router.get("/:eventType", getAllVenues);

// Get a single venue by _id
router.get("/:id", getVenue);

// Create a new venue
router.post("/", authenticate, createVenue);

// Update a venue by _id
router.put("/:id", authenticate, updateVenue);

// Delete a venue by _id
router.delete("/:id", authenticate, deleteVenue);

module.exports = router;
