const express = require("express");
const router = express.Router();
const app=express();
app.use(express.json());

const{storeAllChannelDetails,webhookhandler,getOrders}=require("./allChannel.controller")

router.post("/storeAllChannelDetails",storeAllChannelDetails)
router.post("/webhook-handler",express.raw({ type: "application/json" }),webhookhandler)


router.get("/getOrders",getOrders)

module.exports=router