const express = require('express');
const router = express.Router();

const {
  getAllEventsByUser,
  getEvent,
  getAllEvents,
  bookEvent,
} = require("../Controller/events");

const authenticate = require("../Middleware/authentication");

router.get("/:uid", authenticate, getAllEventsByUser);
router.get("/", authenticate, getAllEvents);
router.get("/:EventId", authenticate, getEvent);
router.post("/:EventId/BookEvent", authenticate, bookEvent);
// router.get("/getEventsNearMe", authenticate, getEventsNearMe);

module.exports = router;
