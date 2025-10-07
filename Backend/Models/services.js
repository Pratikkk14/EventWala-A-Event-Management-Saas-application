const mongoose = require("mongoose");

const Vendor = require("./vendor");


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

module.exports = mongoose.model("Service", serviceSchema);