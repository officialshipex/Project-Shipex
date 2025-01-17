const RateCard = require("../models/rateCards.js");
const zoneManagementController = require("./zoneManagementController.js");
const getZone = zoneManagementController.getZone;



const calculateRate = async (req, res) => {
  try {
    let result = await getZone(req.body.pickupPincode, req.body.deliveryPincode);
    let currentZone = result.zone;
    let ans = [];
    let rateCards = await RateCard.find({type:req.body.plan});
   

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
    console.log(ans);

    res.status(201).json(ans);
  } catch (error) {
    console.log('Error in Calculation');
    res.status(500).json({ error: 'Error in Calculation' });
  }
};


async function calculateRateForService(payload) {
  try {
    const{pickupPincode, deliveryPincode,length,breadth,height,weight, cod, valueInINR,filteredServices,rateCardType}=payload;
    const result = await getZone(pickupPincode.toString(), deliveryPincode.toString());
   
    const currentZone = result.zone;
    const ans = [];
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const deadweight = parseFloat(weight);
    const volumetricWeight = (l * b * h) / 5000;
    const chargedWeight = Math.max(deadweight, volumetricWeight);
    let codCharge = 0;
    const gstRate = 18;

    const rateCards=[];
    for(fls of filteredServices){

      let currentRate=await RateCard.findOne({type:rateCardType,courierProviderName:fls.courierProviderName,courierServiceName:fls.courierProviderServiceName});
      rateCards.push(currentRate);
    }

    const finalRate=rateCards.filter(Boolean);

    for (const rc of finalRate) {
      const basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      const additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);
      const basicChargeForward = parseFloat(rc.weightPriceBasic[0][currentZone].forward);
      const additionalChargeForward = parseFloat(rc.weightPriceAdditional[0][currentZone].forward);
      const finalBasicChargeForward = basicChargeForward;
      const finalAdditionalChargeForward = Math.max(0, Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargeForward);
      const totalForwardCharge = finalBasicChargeForward + finalAdditionalChargeForward;
      const basicChargeRTO = parseFloat(rc.weightPriceBasic[0][currentZone].rto);
      const additionalChargeRTO = parseFloat(rc.weightPriceAdditional[0][currentZone].rto);
      const finalBasicChargeRTO = basicChargeRTO;
      const finalAdditionalChargeRTO = Math.ceil((chargedWeight - basicWeight) / additionalWeight) * additionalChargeRTO;
      const totalRTOCharge = finalBasicChargeRTO + finalAdditionalChargeRTO;

      if (cod === 'Yes') {
        const orderValue = Number(valueInINR) || 0;
        if (typeof rc.codCharge === 'number' && typeof rc.codPercent === 'number') {
          const calculatedCodCharge = Math.max(rc.codCharge, orderValue * (rc.codPercent / 100));
          codCharge += calculatedCodCharge;
        } else {
          console.error("COD charge or percentage is not properly defined.");
        }
      }

      const gstAmountForward = ((totalForwardCharge + codCharge) * (gstRate / 100)).toFixed(2);
      const totalChargesForward = ((totalForwardCharge + codCharge) + (totalForwardCharge + codCharge) * (gstRate / 100)).toFixed(2);
      const gstAmountRTO = ((totalRTOCharge + codCharge) * (gstRate / 100)).toFixed(2);
      const totalChargesRTO = ((totalRTOCharge + codCharge) + (totalRTOCharge + codCharge) * (gstRate / 100)).toFixed(2);

      const allRates = {
        courierServiceName: rc.courierServiceName,
        cod: codCharge,
        forward: {
          charges: totalForwardCharge,
          gst: gstAmountForward,
          finalCharges: totalChargesForward
        },
        rto: {
          charges: totalRTOCharge,
          gst: gstAmountRTO,
          finalCharges: totalChargesRTO
        }
      };

      ans.push(allRates);
    }
    return ans;
  } catch (error) {
    console.error('Error in Calculation:', error);
    throw new Error('Error in Calculation');
  }
}


module.exports = { calculateRate,calculateRateForService};
