const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    addressLine1: String,
    addressLine2: String,
    street: String,
    city: String,
    pincode: String,
    state: String,
    country: String,
  },
  photos: [{ fileId: String }], // or URLs
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, // Master vendor
  capacity: Number,
  amenities: [String],
  eventTypes: [{
    type: String,
    enum: [
      "Baby Shower", "Birthday Party", "Engagement", "Wedding", "Housewarming",
      "Anniversary", "Corporate Event", "Farewell", "Conference", "Workshop"
    ]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

venueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Venue", venueSchema);
