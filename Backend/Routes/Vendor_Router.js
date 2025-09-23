const express = require("express");
const router = express.Router();

// Route definitions
router.get("/", getAllVendors);
router.get("/:vendorId", getVendorById);
router.post("/", createVendor);
router.put("/:vendorId", updateVendorById);
router.delete("/:vendorId", deleteVendorById);
router.put("/:vendorId/logo", updateVendorLogo);
router.get("/:vendorId/venues", getVendorVenues);

module.exports = router;
