const express=require("express");
const router=express.Router();

const { isAuthorized } = require("../../middleware/auth.middleware");
const orderCreationController = require("../Controller/orderCreation.controller");
const generateToken = require("../Controller/tokenGeneration.controller");
const pincodeServiceability = require("../Controller/pincodeServiceability.controller");
const availableCourierService=require("../Controller/availableCourierService.controller")
const bookOrder= require("../Controller/bookOrder.controller");
const cancelOrdersAtBooked = require("../Controller/cancelledOrder.controller");

// Route to create a new order
router.post("/external/createOrder", isAuthorized, orderCreationController);
router.post("/external/generateToken", generateToken);
router.get("/external/pincodeServiceability", isAuthorized, pincodeServiceability);
router.get("/external/serviceableCourierServices/rate", isAuthorized, availableCourierService);
router.post("/external/orderBooking",isAuthorized, bookOrder);
router.post("/external/cancelledOrder/:awb_number", isAuthorized, cancelOrdersAtBooked);

module.exports = router;