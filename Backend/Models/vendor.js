const mongoose = require("mongoose");
const Venue = require("./venue");
const Service = require("./services");

const vendorSchema = new mongoose.Schema({

  uid: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },

  businessName: { type: String, required: true, trim: true },

  contactPerson: { type: String, required: true, trim: true },

  vendorDescription: String,

  phoneNumber: String,

  website: String,

  logoUrl: { type: String }, // Accepts URL from cloud bucket

  venues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }],

  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],

  isVerified: { type: Boolean, default: false },

  accountStatus: {
    type: String,
    enum: ["active", "suspended", "deactivated"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

vendorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Vendor", vendorSchema);