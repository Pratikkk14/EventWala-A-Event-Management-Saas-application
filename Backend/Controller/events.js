const Event = require("../Models/events");

const allowedEventTypes = [
  "Baby Shower",
  "Birthday Party",
  "Engagement",
  "Wedding",
  "Housewarming",
  "Anniversary",
  "Corporate Event",
  "Farewell",
  "Conference",
  "Workshop",
];

// Get all events by type
const getAllEventByType = async (req, res) => {
  try {
    const { EventType } = req.params;
    if (!allowedEventTypes.includes(EventType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event type" });
    }
    const events = await Event.find({ type: EventType });
    res.json({ success: true, events });
  } catch (error) {
    console.error(`[getAllEventByType] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in getAllEventByType: " + error.message,
    });
  }
};

// Get a single event by type and ID
const getEvent = async (req, res) => {
  try {
    const { EventType, EventId } = req.params;
    if (!allowedEventTypes.includes(EventType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event type" });
    }
    const event = await Event.findOne({ _id: EventId, type: EventType });
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, event });
  } catch (error) {
    console.error(`[getEvent] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in getEvent: " + error.message,
    });
  }
};

// Get all events (regardless of type)
//TODO : I have to later add the filter array that will filter out the events based on location,date etc
//sending filter with req is optional  
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json({ success: true, events });
  } catch (error) {
    console.error(`[getAllEvents] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in getAllEvents: " + error.message,
    });
  }
};

// Book an event with date and duration, and prevent double-booking
const bookEvent = async (req, res) => {
  try {
    const { EventType, EventId } = req.params;
    const { date, duration } = req.body;

    if (!allowedEventTypes.includes(EventType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event type" });
    }
    if (!date || !duration) {
      return res
        .status(400)
        .json({ success: false, message: "Date and duration are required" });
    }

    const event = await Event.findOne({ _id: EventId, type: EventType });
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const requestedStart = new Date(date);
    const requestedEnd = new Date(
      requestedStart.getTime() + duration * 60 * 60 * 1000
    );

    const isOverlapping = event.bookings?.some((booking) => {
      const bookingStart = new Date(booking.date);
      const bookingEnd = new Date(
        bookingStart.getTime() + booking.duration * 60 * 60 * 1000
      );
      return requestedStart < bookingEnd && requestedEnd > bookingStart;
    });

    if (isOverlapping) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Selected date/time is already booked",
        });
    }

    event.bookings = event.bookings || [];
    event.bookings.push({ date: requestedStart, duration });
    await event.save();

    res.json({
      success: true,
      message: `Booked event ${EventId} of type ${EventType} on ${requestedStart.toISOString()} for ${duration} hours`,
    });
  } catch (error) {
    console.error(`[bookEvent] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in bookEvent: " + error.message,
    });
  }
};

// Get events near the user's location within a 5 km radius using MongoDB geospatial queries
const getEventsNearMe = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Valid latitude and longitude are required" });
    }

    // Assumes 'location' field is GeoJSON Point: { type: "Point", coordinates: [longitude, latitude] }
    const events = await Event.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 5 / 6378.1], // 5 km radius
        },
      },
    });

    res.json({ success: true, events });
  } catch (error) {
    console.error(`[getEventsNearMe] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in getEventsNearMe: " + error.message,
    });
  }
};

module.exports = {
  getAllEventByType,
  getEvent,
  getAllEvents,
  bookEvent,
  getEventsNearMe,
};
