const express = require('express');
const { getOrders, getProduct, fulFillmentOrders, installApp } = require('../MainServices/mainServices.controller');
const router = express.Router();

router.post('/integrate-shopify',installApp);
router.get('/products',getProduct);
router.get('/orders',getOrders);
router.post('/fulfillment-order',fulFillmentOrders)

module.exports = router;