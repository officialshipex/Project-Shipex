const express = require("express");
const router = express.Router();
const {rtoCharges}=require("./rtoController")

router.post("/rtoCharges",rtoCharges)


module.exports=router