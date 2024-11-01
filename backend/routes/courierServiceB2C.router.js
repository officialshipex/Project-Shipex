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
    importOrders
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

// export default router;
module.exports=router
