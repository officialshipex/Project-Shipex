const express = require('express');
const { getProducts, createProduct,getOrders,createOrder,getShipmentDetails,updateTrackingInfo } = require('../AllCouriers/Woocommerce/Couriers/couriers.controller');

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/orders', getOrders);
router.post('/orders', createOrder);
// Route to fetch shipment details for an order
router.get('/orders/:id/shipment', getShipmentDetails);

// Route to update tracking information for an order
router.put('/orders/:id/tracking', updateTrackingInfo);

module.exports = router;
