const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  // Basic Info
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: String,
  website: String,
  logo: {
    data: Buffer,
    contentType: String,
  },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },

  // Service Options
  providesVenue: {
    type: Boolean,
    default: false,
  },
  venueDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
  },
  venuePhotos: [
    {
      type: Buffer, // Store image binary data
    // Store image MIME type (e.g., 'image/jpeg')
        },
      ],
    // Vendor Type: 'venue' (owns venue), 'lateral' (only provides lateral services), or 'both'
    vendorType: {
      type: String,
      enum: ['venue', 'lateral', 'both'],
      required: true,
      default: 'venue',
    },
    providesLateralServices: {
      type: Boolean,
      default: false,
    },
    lateralServices: [
      {
        name: String,
        description: String,
        price: Number,
        // If vendor does not own a venue, isAddonToVenue should be false or omitted
        isAddonToVenue: {
        type: Boolean,
        default: false,
        },
      },
    ],

  // Private Events Hosted by Vendor
  hostsPrivateEvents: {
    type: Boolean,
    default: false,
  },
  privateEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  // Ratings & Reviews
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      review: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Account Status
  isVerified: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    enum: ["active", "suspended", "deactivated"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
vendorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Vendor", vendorSchema);
