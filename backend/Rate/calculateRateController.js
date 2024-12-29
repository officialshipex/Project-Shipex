const RateCard = require("../models/rateCards.js");
const zoneManagementController = require("./zoneManagementController.js");
const getZone = zoneManagementController.getZone;

const calculateRate = async (req, res) => {
  try {
    let result = await getZone(req.body.pickupPincode, req.body.deliveryPincode);
    let currentZone = result.zone;
    let ans = [];
    let rateCards = await RateCard.find({ defaultRate: true });
   

    let l = parseFloat(req.body.length);
    let b = parseFloat(req.body.breadth);
    let h = parseFloat(req.body.height);
    let deadweight = parseFloat(req.body.weight);
    let volumetricWeight = (l * b * h) / 5000;
    let chargedWeight = Math.max(deadweight, volumetricWeight);

    let cod = 0;
    let gst = 18;

    for (let rc of rateCards) {
      let basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      let additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);

      let basicChargef = parseFloat(rc.weightPriceBasic[0][currentZone].forward);
      let additionalChargef = parseFloat(rc.weightPriceAdditional[0][currentZone].forward);

      let finalBasicChargef = basicChargef;
      let finalAdditionalChargef = Math.max(0,Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargef);
      let finalChargef = finalBasicChargef + finalAdditionalChargef;
     

      let basicChargep = parseFloat(rc.weightPriceBasic[0][currentZone].rto);
      let additionalChargep = parseFloat(rc.weightPriceAdditional[0][currentZone].rto);

      let finalBasicChargep = basicChargep;
      let finalAdditionalChargep = Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargep;
      let finalChargep = finalBasicChargep + finalAdditionalChargep;
  

      if (req.body.cod === 'Yes') {
        const orderValue = Number(req.body.valueInINR) || 0;

        if (typeof rc.codCharge === 'number' && typeof rc.codPercent === 'number') {
          let finalCod = Math.max(rc.codCharge, orderValue * (rc.codPercent / 100));
          
          cod += finalCod;
        } else {
          console.error("COD charge or percentage is not properly defined.");
        }
      }

      let gstAmountf = ((finalChargef + cod) * (gst / 100)).toFixed(2);
      let totchargesf = ((finalChargef + cod) + (finalChargef + cod) * (gst / 100)).toFixed(2);

      let gstAmountp = ((finalChargep + cod) * (gst / 100)).toFixed(2);
      let totchargesp = ((finalChargep + cod) + (finalChargep + cod) * (gst / 100)).toFixed(2);

      let allRates = {};
      allRates.courierServiceName = rc.courierServiceName;
      allRates.cod = cod;
      allRates.forward = {
        charges: finalChargef,
        gst: gstAmountf,
        finalCharges: totchargesf
      };

      allRates.rto = {
        charges: finalChargep,
        gst: gstAmountp,
        finalCharges: totchargesp
      };

      ans.push(allRates);
    }

    res.status(201).json(ans);
  } catch (error) {
    console.log('Error in Calculation');
    res.status(500).json({ error: 'Error in Calculation' });
  }
};

module.exports = { calculateRate };
