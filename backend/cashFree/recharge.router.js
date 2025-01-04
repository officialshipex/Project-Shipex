const express = require('express');
const { handlePaymentOrder, handlePaymentRequest } = require('./recharge.controller');
const router = express.Router();

//Wallet recharge endpoint
router.post('/recharge',handlePaymentOrder);
router.post('/payment',handlePaymentRequest);

module.exports = router;
