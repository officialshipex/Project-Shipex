const express = require("express");

const {getToken}=require("../AllCouriers/Amazon/Authorize/saveCourierController")

const router=express.Router();

router.post("/getToken",getToken);

module.exports=router;