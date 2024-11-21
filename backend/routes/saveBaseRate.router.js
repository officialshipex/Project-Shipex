const express = require("express");
const router = express.Router();

const saveBaseRateController=require("../Rate/saveBaseRateController");
router.post("/",saveBaseRateController.saveBaseRate);

module.exports=router;