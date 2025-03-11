const express = require("express");
const router = express.Router();
const app=express();
app.use(express.json());

const{storeAllChannelDetails,webhookhandler,getOrders,getAllChannel,getOneChannel,updateChannel,deleteChannel}=require("./allChannel.controller")

router.post("/storeAllChannelDetails",storeAllChannelDetails)
router.post("/webhook-handler",express.raw({ type: "application/json" }),webhookhandler)
router.get("/getAllChannel",getAllChannel)
router.get("/getOneChannel/:id",getOneChannel)
router.put("/updateChannel/:id",updateChannel)
router.delete("/delete/:id",deleteChannel)


router.get("/getOrders",getOrders)

module.exports=router