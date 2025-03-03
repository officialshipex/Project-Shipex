const express = require('express');
const router = express.Router();
 
const {codPlanUpdate}=require("./cod.controller")
router.post("/codPlanUpdate",codPlanUpdate)



module.exports = router;