const RateCard = require("../models/rateCards.js");
const zoneManagementController = require("./zoneManagementController.js");
const getZone = zoneManagementController.getZone;

const calculateRate = async (req, res) => {
  try {
    console.log(req.body);
    let result = await getZone(req.body.pickupPincode, req.body.deliveryPincode);
    let currentZone = result.zone;
    let ans = [];
    let rateCards = await RateCard.find({ defaultRate: true });
    console.log(rateCards);

    let l = parseFloat(req.body.length);
    let b = parseFloat(req.body.breadth);
    let h = parseFloat(req.body.height);
    let deadweight = parseFloat(req.body.weight);
    let volumetricWeight = (l * b * h) / 5000;
    let chargedWeight = Math.max(deadweight, volumetricWeight);

    let cod = 0;
    let gst = req.body.gst || 18;

    for (let rc of rateCards) {
      let basicWeight = parseFloat(rc.weightPriceBasic[0].weight) / 1000;
      let additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight) / 1000;

      let basicChargef = parseFloat(rc.weightPriceBasic[0][currentZone].forward);
      let additionalChargef = parseFloat(rc.weightPriceAdditional[0][currentZone].forward);

      let finalBasicChargef = basicChargef;
      let finalAdditionalChargef = Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargef;
      let finalChargef = finalBasicChargef + finalAdditionalChargef;
      console.log(finalChargef);

      let basicChargep = parseFloat(rc.weightPriceBasic[0][currentZone].rto);
      let additionalChargep = parseFloat(rc.weightPriceAdditional[0][currentZone].rto);

      let finalBasicChargep = basicChargep;
      let finalAdditionalChargep = Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargep;
      let finalChargep = finalBasicChargep + finalAdditionalChargep;
      console.log(finalChargep);

      if (req.body.paymentMode === 'cod') {
        const orderValue = Number(req.body.value) || 0;
        
        if (typeof rc.codCharge === 'number' && typeof rc.codPercent === 'number') {
          let finalCod = Math.max(rc.codCharge, orderValue * (rc.codPercent / 100));
          console.log("cod", finalCod);
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

    console.log(ans);
    res.status(201).json(ans);
  } catch (error) {
    console.log('Error in Calculation');
    res.status(500).json({ error: 'Error in Calculation' });
  }
};

module.exports = { calculateRate };
