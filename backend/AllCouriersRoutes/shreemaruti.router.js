const express = require('express');
const router = express.Router();
const {
 saveShreeMaruti,
 isEnabeled,
 enable,
 disable
} = require('../AllCouriers/ShreeMaruti/Authorize/shreeMaruti.controller');

const shreeMarutiController=require("../AllCouriers/ShreeMaruti/Couriers/couriers.controller");

router.get('/saveNew',saveShreeMaruti);
router.get('/isEnabeled',isEnabeled);
router.get('/enable',enable);
router.get('/disable',disable);

router.get('/getCourierList',shreeMarutiController.getCourierList);
router.post("/addService", shreeMarutiController.addService);
router.post('/create-order',shreeMarutiController.createOrder);




module.exports = router;
