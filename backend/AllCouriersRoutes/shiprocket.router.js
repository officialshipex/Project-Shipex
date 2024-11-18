
const express = require("express");
const router = express.Router();

const { getAllActiveCourierServices } = require("../AllCouriers/ShipRocket/Couriers/couriers.controller");
const {
    createCustomOrder,

    updateOrder,
    cancelOrder,

    listCouriers,
    checkServiceability,
    requestShipmentPickup,

    createReturnOrder,

    generateManifest,

    generateLabel,
    generateInvoice,
    getAllNDRShipments,

    getTrackingByAWB,

    getTrackingByOrderID,

} = require('../AllCouriers/ShipRocket/MainServices/mainServices.controller');

router.post("/getAllActiveCourierServices", getAllActiveCourierServices);
router.post("/getCourierServicesFromDatabase", getCourierServicesFromDatabase);
router.post('/create-custom-order', createCustomOrder);

router.put('/update-order/:order_id', updateOrder);
router.delete('/cancel-order/:order_id', cancelOrder);

// List of Couriers
router.get('/couriers', listCouriers);

// Check Courier Serviceability
router.get('/courier-serviceability', checkServiceability);

// Request for Shipment Pickup
router.post('/request-pickup', requestShipmentPickup);




// Create a Return Order
router.post('/return-order', createReturnOrder);





// Generate Manifest
router.post('/manifest/generate', generateManifest);



// Generate Label
router.post('/label/generate', generateLabel);

// Generate Invoice
router.post('/invoice/generate', generateInvoice);

// Get All NDR Shipments
router.get('/ndr/all', getAllNDRShipments);



// Get Tracking through AWB
router.get('/track/awb/:awb_code', getTrackingByAWB);



// Get Tracking Data through Order ID
router.get('/track/order/:order_id', getTrackingByOrderID);





// export default router;
module.exports=router