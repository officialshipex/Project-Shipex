const Order = require("../models/newOrder.model");
const Plan = require("../models/Plan.model");
const rateCards = require("../models/rateCards");
const zoneManagementController = require("../Rate/zoneManagementController");
const getZone = zoneManagementController.getZone;
const rtoCharges = async (req, res) => {
  try {
    const userID = req.user?._id;
    if (!userID) {
      return res.status(400).json({ message: "User ID not found in request." });
    }

    const order = await Order.find({
      userId: userID,
      status: "RTO",
      RTOCharges: { $exists: false },
    });
    order.map(async (item) => {
      let result = await getZone(
        item.pickupAddress.pinCode,
        item.receiverAddress.pinCode
      );
      let currentZone = result.zone;
      const plans = await Plan.findOne({ userId: item.userId });
      
      const ratecards = await rateCards.findOne({
        plan: plans.planName,
        courierServiceName: item.courierServiceName,
      });


      //  console.log("----------->",item.packageDetails.applicableWeight * 1000)
      const extraWeight=item.packageDetails.applicableWeight * 1000-ratecards.weightPriceBasic[0].weight
      const extraWeightCount = Math.ceil(extraWeight / ratecards.weightPriceAdditional[0].weight);
      let basicChargef = parseFloat(ratecards.weightPriceBasic[0][currentZone])
      // console.log("----------->",extraWeight)
      let charges=basicChargef
      if(extraWeight!==0){
        charges+=parseFloat(ratecards.weightPriceAdditional[0][currentZone])*extraWeightCount
      }
     
      // const applicableWeight =
      //   item.packageDetails.applicableWeight * 1000 -
      //   ratecards.weightPriceBasic[0][currentZone];
      //   console.log("----------->",applicableWeight)
      // let basicChargef = parseFloat(ratecards.weightPriceBasic[0][currentZone]);
      // let totalChargesForward = basicChargef;
    });
    
  } catch (error) {
    console.error("Error in rtoCharges:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  rtoCharges,
};
