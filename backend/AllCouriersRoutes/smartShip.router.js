const express = require('express');
const {
    OneStapOrderRegisteration,
    orderRegistration,
    getOrderDetails,
    createManifest,
    getShippingLabel,
    cancelOrder,
    trackOrderByTrackingID,
    trackOrderByRequestorderId,
    trackOrderByOrderReferenceId} = require('../AllCouriers/SmartShip/MainServices/mainServices.controller.js');

// const { getAccessToken } = require('../AllCouriers/SmartShip/Authorize/smartShip.controller.js');

const router = express.Router();

// router.post('/get-token',getAccessToken)
router.post('/one-step-order-register',OneStapOrderRegisteration);
router.post('/order-register',orderRegistration);
router.post('/get-order-details',getOrderDetails);
router.post('/create-manifest',createManifest); 
router.post('/get-shipping-label',getShippingLabel);
router.post('/cancel-order',cancelOrder);
router.get('/track-by-number',trackOrderByTrackingID);
router.get('/track-by-request-id',trackOrderByRequestorderId);
router.get('/track-by-referance-id',trackOrderByOrderReferenceId);

// router.post('/hub-register',hubRegistration);
// router.post('/get-hub-details',getHubDetails);
// router.post('/delete-Hub',deleteHub);

module.exports = router;