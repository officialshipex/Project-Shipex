const express = require("express");
const {
  newOrder,
  getOrders,
  updatedStatusOrders,
  getOrdersById,
  getpickupAddress,
  getreceiverAddress,
  ShipeNowOrder,
  getPinCodeDetails,
  cancelOrdersAtNotShipped,
  cancelOrdersAtBooked,
  updateOrder
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
router.get("/ship/:id", ShipeNowOrder);
router.get("/pincode/:pincode", getPinCodeDetails);
router.post("/cancelOrdersAtNotShipped",cancelOrdersAtNotShipped)
router.post("/cancelOrdersAtBooked",cancelOrdersAtBooked)
module.exports = router;
