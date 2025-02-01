const express = require('express');
const {newOrder,getOrders}  = require('../Orders/newOrder.controller'); // Adjust path to your controller
const router = express.Router();

// Route to create a shipment
router.post('/neworder', newOrder);
router.get('/orders', getOrders);

module.exports = router;
