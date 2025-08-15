const express = require('express');


const  {saveVamaship}= require('../AllCouriers/Vamaship/Authorize/vamaShip.controller');
const { createVamashipShipment } = require('../AllCouriers/Vamaship/Couriers/couriers.controller');

const router = express.Router();




router.post("/authorize",saveVamaship);
router.post("/createShipment",createVamashipShipment);


module.exports = router;