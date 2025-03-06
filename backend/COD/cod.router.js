const express = require('express');
const router = express.Router();
 
const {codPlanUpdate,codRemittanceData}=require("./cod.controller")
router.post("/codPlanUpdate",codPlanUpdate)
router.get("/codRemittanceData",codRemittanceData)



module.exports = router;