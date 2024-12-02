const express = require('express');
const { getPincodeInfo,createNewShipment,getShippingLabel,getTrackingStatus,cancelShipment,saveDtdcCourier} = require('../mainServices/mainServices.controller');

const router = express.Router();

// Route for creating a new consignment
router.get('/seveNewCourier',saveDtdcCourier);
router.post('/getpincode',getPincodeInfo);
router.post('/create-order', createNewShipment);
router.get('/getShippingLabel',getShippingLabel);
router.post('/trackingOrder',getTrackingStatus)
router.post('/cancel-order',cancelShipment);

module.exports = router;
