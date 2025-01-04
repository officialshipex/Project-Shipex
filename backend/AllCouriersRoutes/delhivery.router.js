const express = require("express");
const {
  checkPincodeServiceability,
  trackShipment,
  generateShippingLabel,
  createPickupRequest,
  createClientWarehouse,
} = require("../AllCouriers/Delhivery/Courier/couriers.controller");

const router = express.Router();

// Route to check pincode serviceability
router.get("/serviceability/:pincode", checkPincodeServiceability);
// Route to track shipment
router.get("/track/:waybill", trackShipment);
// Route to generate shipping label
router.get("/label/:waybill", generateShippingLabel);
// Route to create a pickup request
router.post("/pickup", createPickupRequest);
// Route to create a client warehouse
router.post("/warehouse", createClientWarehouse);

module.exports = router;
