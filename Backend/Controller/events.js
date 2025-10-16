const Event = require("../Models/events");
const User = require("../Models/users");

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

// Get all events of a user irrespective of status
const getAllEventsByUser = async (req, res) => {
  try {
    const userId = req.params.uid; // This will now be the MongoDB ObjectId
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Directly query events using the MongoDB ObjectId
    const events = await Event.find({ host: userId })
      .populate({
        path: 'venue',
        select: '_id name address capacity location'
      })
      .populate({
        path: 'vendor',
        select: '_id uid name businessName contactPerson email phoneNumber price'
      })
      .populate({
        path: 'host',
        select: '_id uid firstName lastName'
      });
    res.json({ success: true, events });
  } catch (error) {
    console.error(`[getAllEventsByUser] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in getAllEventsByUser: " + error.message,
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

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      date, 
      description, 
      host, 
      venue, 
      venueName,
      vendor, 
      budget, 
      guests, 
      eventStatus 
    } = req.body;

    if (!name || !type || !date || !eventStatus) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, type, date, and eventStatus are required" 
      });
    }

    if (!allowedEventTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid event type" 
      });
    }

    // Get user from authentication
    let hostUser;
    
    // Get authenticated user from request
    if (req.user && req.user.uid) {
      hostUser = await User.findOne({ uid: req.user.uid });
      
      if (!hostUser) {
        return res.status(404).json({
          success: false,
          message: "Authenticated user not found in database"
        });
      }
    } else if (req.body.userId) {
      // If no user in request but userId provided in body, use that
      hostUser = await User.findOne({ uid: req.body.userId });
      
      if (!hostUser) {
        return res.status(404).json({
          success: false,
          message: "User specified in request not found in database"
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication required to create events"
      });
    }

    // Create the new event
    const newEvent = new Event({
      name,
      type,
      date: new Date(date),
      description,
      host: hostUser._id, // Use the authenticated user's MongoDB ObjectId
      venue: venue || null,
      vendor: vendor || null,
      eventStatus: eventStatus || "Pending",
      guests: guests || 0
    });

    // Save the new event
    const savedEvent = await newEvent.save();
    
    // Add the event to the user's eventsHosted array
    hostUser.eventsHosted.push(savedEvent._id);
    await hostUser.save();
    
    console.log(`Event ${savedEvent._id} created and added to user ${hostUser._id}`);
    
    res.status(201).json({ 
      success: true, 
      message: "Event created successfully", 
      eventId: savedEvent._id 
    });
  } catch (error) {
    console.error(`[createEvent] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in createEvent: " + error.message,
    });
  }
};

// Update an event's status
const updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { eventStatus } = req.body;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required"
      });
    }
    
    if (!eventStatus || !['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(eventStatus)) {
      return res.status(400).json({
        success: false,
        message: "Valid event status is required"
      });
    }
    
    // Find the event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    
    // Update the status
    event.eventStatus = eventStatus;
    await event.save();
    
    res.json({
      success: true,
      message: `Event status updated to ${eventStatus}`,
      event: {
        _id: event._id,
        name: event.name,
        type: event.type,
        eventStatus: event.eventStatus
      }
    });
    
  } catch (error) {
    console.error(`[updateEventStatus] Error:`, error);
    res.status(500).json({
      success: false,
      message: "Error in updateEventStatus: " + error.message
    });
  }
};

module.exports = {
  getAllEventsByUser,
  getEvent,
  getAllEvents,
  bookEvent,
  createEvent,
  updateEventStatus
};
