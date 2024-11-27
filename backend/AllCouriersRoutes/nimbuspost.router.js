const express = require("express");
const router = express.Router();

const {saveNimbusPost}=require("../../backend/AllCouriers/NimbusPost/Authorize/nimbuspost.controller");
const nimbuspostCourierController=require("../AllCouriers/NimbusPost/Couriers/couriers.controller");
const nimbuspostShipmentController=require("../AllCouriers/NimbusPost/Shipments/shipments.controller");
const nimbuspostNDRController=require("../AllCouriers/NimbusPost/NDR/ndr.controller");

router.get('/saveNew',saveNimbusPost);

router.get("/getAndUpdateCourierServices",nimbuspostCourierController.getCouriers);
router.post("/getServiceablePincodes",nimbuspostCourierController.getServiceablePincodes);
router.post("/getServiceablePincodesData",nimbuspostCourierController.getServiceablePincodesData);

router.post("/createShipment",nimbuspostShipmentController.createShipment);
router.post("/trackShipment",nimbuspostShipmentController.trackShipment);
router.post("/trackShipmentInBulk",nimbuspostShipmentController.trackShipmentsInBulk);
router.post("/manifest",nimbuspostShipmentController.manifest);
router.post("/cancelShipment",nimbuspostShipmentController.cancelShipment);
router.post("/hyperLocalShipment",nimbuspostShipmentController.createHyperlocalShipment);

router.post("/getNdrDetails",nimbuspostNDRController.getNdrDetails);
router.post("/performNdrActions",nimbuspostNDRController.performNdrActions);


module.exports=router;



