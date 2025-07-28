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
    trackOrderByOrderReferenceId,
    getCouriers,addService} = require('../AllCouriers/SmartShip/Couriers/couriers.controller');

const  {saveSmartShip}= require('../AllCouriers/SmartShip/Authorize/smartShip.controller');

const router = express.Router();


router.get("/getCouriers",getCouriers);

router.post("/addService",addService);
router.post("/authorize",saveSmartShip);

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