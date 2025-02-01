const express = require('express');
const router = express.Router();

const getAllCouriers = require('../AllCouriers/getActiveCourier');

router.get('/couriers',getAllCouriers);


module.exports = router;