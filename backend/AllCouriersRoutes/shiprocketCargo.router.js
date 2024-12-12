const express = require('express');
const { 
    createCustomCargoOrder,
    createShipment,
    getShipmentDetails,
    getOrderDetails,
    getTrackingBywaybillno
    } = require('../AllCouriers/ShipRocketCargo/MainServices/mainServices.controller');

const router = express.Router();

router.post('/create-order', createCustomCargoOrder);
router.post('/order-shipment',createShipment);
router.get('/get-shipment-details',getShipmentDetails);
router.get('/get-order-details',getOrderDetails);
router.get('/track-order', getTrackingBywaybillno);

module.exports = router;