const express = require("express");
const router = express.Router();


module.exports = { submitNDRResolutionsforward ,submitNDRResolutionsRev};


   


    const ecomCourierController=require("../AllCouriers/EcomExpress/Couriers/couriers.controllers");
    const ecomNdrController=require("../AllCouriers/EcomExpress/NDR/ndr.controller");

    router.get('/getPincodes',ecomCourierController.getPincodes);
    router.post("/getPincodeDetails",ecomCourierController.getPincodeDetails);
    router.post("/checkServicibility",ecomCourierController.checkServiceability);
    router.post("/fetchAwb",ecomCourierController.fetchAWB);
    router.post("/ndrDataForward",ecomNdrController.submitNDRResolutionsforward);

    

    // FORWARD JOURNEY
    router.post("/createForwardOrder",ecomCourierController.createManifestAWBforward);
    router.post("/trackShipmentForward",ecomCourierController.shipmentTrackingforward);
    router.post("/cancelShipmentForward",ecomCourierController.cancelShipmentforward);
    router.post("/ndrDataRto",ecomNdrController.submitNDRResolutionsRev);


    // REVERSE JOURNEY
    router.post("/createRtoOrder",ecomCourierController.manifestAwbRev);
    router.post("/trackRtoOrder",ecomCourierController.shipmentTrackingRev);
    router.post("/cancelRtoOrder",ecomCourierController.cancelShipmentRev);

    module.exports=router;
   


    
    
