const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info (from Firebase Auth)
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

    // Profile Information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+?[\d\s-]+$/.test(v);
        },
      },
    },

    // Additional Details
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    avatar: {
      data: {
        type: Buffer, // Store image binary data
      },
      contentType: String, // Store image MIME type (e.g., 'image/jpeg')
    },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    // Preferences
    preferences: {
      eventNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },

    // Role & Status
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
    accountType: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free",
    },

    // Activity Tracking
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Social Links
    socialProfiles: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },

    // Event History - from my_bookings
    eventsHosted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    // Past guests or attendees - from my_bookings
    eventsAttended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    // Bookmarked venues-filled from the event page
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    ],

    // Payment & Billing
    defaultPaymentMethod: String,
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

// Update timestamp on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);
