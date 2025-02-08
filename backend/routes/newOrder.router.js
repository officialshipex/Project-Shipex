const express = require('express');
const {newOrder,getOrders,getpickupAddress,getreceiverAddress}  = require('../Orders/newOrder.controller'); // Adjust path to your controller
const router = express.Router();

// Route to create a shipment
router.post('/neworder', newOrder);
router.get('/orders', getOrders);
router.get('/pickupAddress', getpickupAddress);
router.get('/receiverAddress', getreceiverAddress);

module.exports = router;
