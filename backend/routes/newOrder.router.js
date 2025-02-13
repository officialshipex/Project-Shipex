const express = require("express");
const {
  newOrder,
  getOrders,
  getpickupAddress,
  getreceiverAddress,
  ShipeNowOrder,
  getPinCodeDetails,
  cancelOrdersAtNotShipped,
  cancelOrdersAtBooked
} = require("../Orders/newOrder.controller"); // Adjust path to your controller
const router = express.Router();

// Route to create a shipment
router.post("/neworder", newOrder);
router.get("/orders", getOrders);
router.get("/pickupAddress", getpickupAddress);
router.get("/receiverAddress", getreceiverAddress);
router.get("/ship/:id", ShipeNowOrder);
router.get("/pincode/:pincode", getPinCodeDetails);
router.post("/cancelOrdersAtNotShipped",cancelOrdersAtNotShipped)
router.post("/cancelOrdersAtBooked",cancelOrdersAtBooked)
module.exports = router;
