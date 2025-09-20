const mongoose = require("mongoose");
const Venue = require("./venue");


const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  isAddonToVenue: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

serviceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
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
    ],
    required: true,
  },
  date: Date,
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
  description: String,
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = {
  Service: mongoose.model("Service", serviceSchema),
  Event: mongoose.model("Event", eventSchema)
};
