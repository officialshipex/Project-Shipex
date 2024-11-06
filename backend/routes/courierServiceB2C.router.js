// import express from "express";
const express = require("express")
const { getAllActiveCourierServices, getCourierServicesFromDatabase }= require("../B2C/courierService.controller");
const {
    createCustomOrder,
    createChannelOrder,
    updatePickupLocation,
    updateDeliveryAddress,
    updateOrder,
    cancelOrder,
    addInventory,
    mapProducts,
    importOrders,
    generateAWB,
    listCouriers,
    checkServiceability,
    requestShipmentPickup,
    getAllOrders,
    getOrderDetails,
    exportOrders,
    createReturnOrder,
    getAllReturnOrders,
    checkCourierServiceability,
    generateReturnAWB,
    getAllShipments,
    getShipmentDetails,
    cancelShipment
} = require('../B2C/shiprocket.controller');

const router = express.Router();

router.post("/getAllActiveCourierServices", getAllActiveCourierServices);
router.post("/getCourierServicesFromDatabase", getCourierServicesFromDatabase);
router.post('/create-custom-order', createCustomOrder);
router.post('/create-channel-order', createChannelOrder);
router.put('/update-pickup-location/:order_id', updatePickupLocation);
router.put('/update-delivery-address/:order_id', updateDeliveryAddress);
router.put('/update-order/:order_id', updateOrder);
router.delete('/cancel-order/:order_id', cancelOrder);
router.post('/add-inventory', addInventory);
router.post('/map-products', mapProducts);
router.post('/import-orders', importOrders);
// Generate AWB for Shipment
router.post('/generate-awb', generateAWB);

// List of Couriers
router.get('/couriers', listCouriers);

// Check Courier Serviceability
router.get('/courier-serviceability', checkServiceability);

// Request for Shipment Pickup
router.post('/request-pickup', requestShipmentPickup);
// Get All Orders
router.get('/orders', getAllOrders);

// Get Specific Order Details
router.get('/orders/:order_id', getOrderDetails);

// Export Orders
router.get('/orders/export', exportOrders);

// Create a Return Order
router.post('/return-order', createReturnOrder);

// Get All Return Orders
router.get('/return-orders', getAllReturnOrders);

// Check Courier Serviceability
router.get('/courier-serviceability', checkCourierServiceability);

// Generate AWB for Return Shipment
router.post('/return-awb', generateReturnAWB);

// Get All Shipment Details
router.get('/shipments', getAllShipments);

// Get Details of Specific Shipment
router.get('/shipments/:shipment_id', getShipmentDetails);

// Cancel a Shipment
router.post('/shipments/cancel', cancelShipment);



// export default router;
module.exports=router
