const express = require('express');
const router = express.Router();

const {
  getAllEventByType,
  getEvent,
  getAllEvents,
  bookEvent,
  getEventsNearMe,
} = require("../Controller/events");

const authenticate = require("../Middleware/authentication");

router.get("/:EventType", authenticate, getAllEventByType);
router.get("/", authenticate, getAllEvents);
router.get("/:EventId", authenticate, getEvent);
router.post("/:EventId/BookEvent", authenticate, bookEvent);
router.get("/getEventsNearMe", authenticate, getEventsNearMe);

module.exports = router;
