const express = require("express");
const {
  newOrder,
  getOrders,
  updatedStatusOrders,
  getOrdersById,
  getpickupAddress,
  newPickupAddress,
  newReciveAddress,
  getreceiverAddress,
  ShipeNowOrder,
  getPinCodeDetails,
  cancelOrdersAtNotShipped,
  cancelOrdersAtBooked,
  // tracking,
  updateOrder,
  passbook,
  getUser,
  trackOrders,
  GetTrackingByAwb
  
} = require("../Orders/newOrder.controller"); // Adjust path to your controller
const router = express.Router();

// Route to create a shipment
router.put("/updateOrder/:orderId", updateOrder);
router.post("/neworder", newOrder);
router.get("/orders", getOrders);
router.post("/clone",updatedStatusOrders)
router.get("/getOrderById/:id",getOrdersById)
router.get("/pickupAddress", getpickupAddress);
router.get("/receiverAddress", getreceiverAddress);
router.post("/pickupAddress", newPickupAddress);
router.post("/receiverAddress", newReciveAddress);
router.get("/ship/:id", ShipeNowOrder);
router.get("/pincode/:pincode", getPinCodeDetails);
router.post("/cancelOrdersAtNotShipped",cancelOrdersAtNotShipped)
router.post("/cancelOrdersAtBooked",cancelOrdersAtBooked)
// router.post("/tracking",tracking)
router.get("/passbook",passbook)
router.get("/getUser",getUser)
router.post("/webhookTracking",trackOrders)
router.get("/GetTrackingByAwb/:awb",GetTrackingByAwb)
module.exports = router;
