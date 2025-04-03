const Order=require("../models/newOrder.model")
const Plan=require("../models/Plan.model")
const rateCards=require("../models/rateCards")
const zoneManagementController = require("../Rate/zoneManagementController");
const getZone = zoneManagementController.getZone;
const rtoCharges = async (req, res) => {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID not found in request." });
      }

     const order= await Order.find({userId})
      order.map((item)=>{
       item.tracking.filter(async(e)=>{
         if(e.Instructions==="Consignee refused to accept/order cancelled" && item.status!=="RTO"){
          // await Order.updateOne({ _id: item._id }, { $set: { status: "RTO" } });
          let result = await getZone(
            item.pickupAddress.pinCode,
            item.receiverAddress.pinCode
          );
          let currentZone = result.zone;
          const plans=await Plan.findOne({userId})
          const ratecards = await rateCards.findOne({ 
            plan: plans.planName,courierServiceName:item.courierServiceName 
          });
          const applicableWeight=((item.packageDetails.applicableWeight)*1000)-(ratecards.weightPriceBasic[0][currentZone])
          
          // console.log(ratecards)
          let basicChargef = parseFloat(ratecards.weightPriceBasic[0][currentZone]);
          let totalChargesForward=basicChargef
          // if(){

          // }
          
         }
       })
      })
    //   res.status(200).json({ message: "RTO charges processed successfully." });
    } catch (error) {
      console.error("Error in rtoCharges:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

module.exports={
    rtoCharges
}
