const express = require("express");
const router = express.Router();

const nimbuspostAuthorizeController=require("../../AllCouriers/B2B/NimbusPost/Courier/courier.controller");

router.post("/createOrder",nimbuspostAuthorizeController.createOrder);
router.get("/trackSingleShipment",nimbuspostAuthorizeController.trackShipment);
router.post("/manifestOrder",nimbuspostAuthorizeController.manifestOrder);
router.post("/cancelManifestOrder",nimbuspostAuthorizeController.cancelManifestOrder);
router.post("/getCouriers",nimbuspostAuthorizeController.rateAndServiceability);

module.exports={router};
