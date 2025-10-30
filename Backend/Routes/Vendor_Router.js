const express = require("express");
const router = express.Router();
const {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendorById,
  deleteVendorById,
  updateVendorLogo,
  getVendorVenues,
} = require("../Controller/vendor");

// Route definitions
router.get("/", getAllVendors);
router.get("/:uid", getVendorById);
router.post("/", createVendor);
router.put("/:vendorId", updateVendorById);
router.delete("/:vendorId", deleteVendorById);
router.put("/:vendorId/logo", updateVendorLogo);
router.get("/:vendorId/venues", getVendorVenues);

module.exports = router;
