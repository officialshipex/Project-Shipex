const express = require("express");
const router = express.Router();

const DelhiveryCourierController=require("../../AllCouriers/B2B/Delhivery/Courier/courier.controller");


router.post("/getTatEstimate",DelhiveryCourierController.getTatEstimate);
router.get("/getPincodeService/:pincode",DelhiveryCourierController.getPincodeService);
router.post("/createClientWarehouse",DelhiveryCourierController.createClientWarehouse);
router.get("/createPickupRequest",DelhiveryCourierController.createPickupRequest);
router.get("/deletePickupRequest/:pickup_id",DelhiveryCourierController.deletePickupRequest);
router.post("createManifest",DelhiveryCourierController.createManifest);
router.get("/getManifestStatus",DelhiveryCourierController.getManifestStatus);

module.exports=router;