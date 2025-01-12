const express = require('express');
const router = express.Router();
// const {
//     createOrder,
//     cancelOrder,
//     downloadLabelInvoice,
//     createManifest,
//     trackOrder,
//     checkServiceability,

// } = require('../AllCouriers/ShriMaruti/Couriers/couriers.controller');

const ShreeMarutiAuthorizeController=require("../AllCouriers/ShreeMaruti/Authorize/shreeMaruti.controller");
const shreeMarutiController=require("../AllCouriers/ShreeMaruti/Couriers/couriers.controller");

// const router = express.Router();

// console.log(createOrder)

router.get('/saveNew',ShreeMarutiAuthorizeController.saveShreeMaruti);
router.get('/isEnabeled',ShreeMarutiAuthorizeController.isEnabeled);
router.get('/enable',ShreeMarutiAuthorizeController.enable);
router.get('/disable',ShreeMarutiAuthorizeController.disable);
router.get('/getCourierList',shreeMarutiController.getCourierList);

router.post('/addService',shreeMarutiController.addService);

router.post('/create-order', shreeMarutiController.createOrder);

// router.delete('/cancel-order/:orderId', shreeMarutiController.cancelOrder);
router.get('/download-label-invoice/:orderId', shreeMarutiController.downloadLabelInvoice);
router.post('/create-manifest', shreeMarutiController.createManifest);
router.get('/track-order/:orderId', shreeMarutiController.trackOrder);
// router.post('/serviceability', shreeMarutiController.checkServiceability);


module.exports = router;