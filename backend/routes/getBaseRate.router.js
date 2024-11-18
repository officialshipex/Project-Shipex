const express = require("express");
const router = express.Router();

const getBaseRateController=require("../Rate/getBaseRateController");

router.get("/",getBaseRateController.getBaseRates);

module.exports=router;