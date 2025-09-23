const Vendor = require("../Models/vendor");
const Venue = require("../Models/venue");

// Controller functions
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.vendorId,
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.vendorId);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateVendorLogo = async (req, res) => {
  try {
    const { logoUrl } = req.body;
    if (!logoUrl) return res.status(400).json({ error: "logoUrl is required" });
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.vendorId,
      { logoUrl },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getVendorVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ vendor: req.params.vendorId });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendorById,
  deleteVendorById,
  updateVendorLogo,
  getVendorVenues,
};
