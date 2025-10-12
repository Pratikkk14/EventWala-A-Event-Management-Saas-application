const mongoose = require("mongoose");

const Vendor = require("./vendor");
const User = require("./users");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discountPercentage: { type: Number, min: 0, max: 100 },
  validFrom: { type: Date },
  validTo: { type: Date },
  isActive: { type: Boolean, default: true },
});

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
  photo: [{
  fileId: String,
  url: String,
  fileName: String,
  uploadedAt: { type: Date, default: Date.now }
}],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Master vendor
  vendorReview: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reviewer
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  venuePrices: [
    {
      eventType: {
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
      price: { type: Number, required: true },
    },
  ],
  capacity: Number,
  amenities: [String],
  eventTypes: [
    {
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
    },
  ],
  offers: [offerSchema],
  location: {
    type: {
      type: String,
      enum: ["Point"], // 'location.type' must always be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

venueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Venue", venueSchema);