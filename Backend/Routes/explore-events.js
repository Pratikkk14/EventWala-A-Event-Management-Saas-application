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
const { route } = require('./DB_Router');

router.get("/:EventType", authenticate, getAllEventByType);
router.get("/:EventType/:EventId", authenticate, getEvent);
router.get("/getAllEvents", authenticate, getAllEvents);
router.post("/:EventType/:EventId/BookEvent", authenticate, bookEvent);
router.get("/getEventsNearMe", getEventsNearMe);

module.exports = router;
