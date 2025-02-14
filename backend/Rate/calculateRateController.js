const RateCard = require("../models/rateCards.js");
const zoneManagementController = require("./zoneManagementController.js");
const getZone = zoneManagementController.getZone;
const Plan = require("../models/Plan.model.js");

const calculateRate = async (req, res) => {
  try {
    const id = req.user._id;
    let result = await getZone(
      req.body.pickUpPincode,
      req.body.deliveryPincode
    );
    let currentZone = result.zone;
    const plan = await Plan.findOne({ userId: id })
    
    let rateCards = plan.rateCard;

    let ans = [];
    const chargedWeight = req.body.applicableWeight * 1000;
    let cod = 0;
    let gst = 18; 
    // console.log(chargedWeight);
     let provider;
     let mode;
    for (let rc of rateCards) {
      // console.log(rc);
        provider=rc.courierProviderName
        mode=rc.mode
        // console.log("sadsdasd",provider)
      // let basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      // let additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);

      let basicChargef = parseFloat(rc.weightPriceBasic[0][currentZone]);
      let additionalChargef = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );

      let finalChargef;

      if (rc.weightPriceBasic[0].weight <= chargedWeight) {
        finalChargef = basicChargef;
      } else {
        finalChargef = basicChargef + additionalChargef;
      }
      if (req.body.paymentType === "COD") {
        const orderValue = Number(req.body.declaredValue) || 0;
        if (
          typeof rc.codCharge === "number" &&
          typeof rc.codPercent === "number"
        ) {
          let finalCod = Math.max(
            rc.codCharge,
            orderValue * (rc.codPercent / 100)
          );

          cod += finalCod;
        } else {
          console.error("COD charge or percentage is not properly defined.");
        }
      }
     

      let gstAmountf = (finalChargef + cod) * (gst / 100).toFixed(2);
      let totchargesf = (
        finalChargef +
        cod +
        gstAmountf
      )

      let allRates = {};
      allRates.courierServiceName = rc.courierServiceName;
      allRates.cod = cod;
      allRates.provider=provider
      allRates.mode=mode
      allRates.forward = {
        charges: finalChargef,
        gst: gstAmountf,
        finalCharges: totchargesf,
      };
      
      ans.push(allRates);
      // console.log("Sadsdsad",ans)
    }

    res.status(201).json(ans);
  } catch (error) {
    console.log("Error in Calculation");
    res.status(500).json({ error: "Error in Calculation" });
  }
};

async function calculateRateForService(payload) {
  console.log(payload);

  try {
    const {
      pickupPincode,
      deliveryPincode,
      length,
      breadth,
      height,
      weight,
      cod,
      valueInINR,
      filteredServices,
      // rateCardType,
    } = payload;

    // console.log("sasasdasd",payload);

    const result = await getZone(pickupPincode, deliveryPincode);
    console.log("result", result);

    const currentZone = result.zone;
    // console.log("oasjdasdsa",filteredServices)
    const ans = [];
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const deadweight = parseFloat(weight) / 1000;
    const volumetricWeight = (l * b * h) / 5000;
    // const chargedWeight = Math.max(deadweight, volumetricWeight);
    const chargedWeight = weight * 1000;
    // console.log("jugbhjbj",chargedWeight);

    let codCharge = 0;
    const gstRate = 18;

    const rateCards = [];
    for (fls of filteredServices) {
      // console.log("1231323123",fls);
      // console.log("kjsadkjskd",fls)
      let currentRate = await RateCard.findOne({
        courierProviderName: fls.item.provider,
        courierServiceName: fls.item.name,
      });
      rateCards.push(currentRate);
    }
    const finalRate = rateCards.filter(Boolean);

    for (const rc of finalRate) {
      const basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      const additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);
      const basicChargeForward = parseFloat(
        rc.weightPriceBasic[0][currentZone]
      );
      const additionalChargeForward = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );

      const finalBasicChargeForward = basicChargeForward;
      let totalForwardCharge;
      if (rc.weightPriceBasic[0].weight <= chargedWeight) {
        const finalAdditionalChargeForward = Math.max(
          0,
          Math.ceil(weight / additionalWeight) * additionalChargeForward
        );
        totalForwardCharge =
          finalBasicChargeForward + finalAdditionalChargeForward;
      } else {
        totalForwardCharge = finalBasicChargeForward;
      }

      if (cod === "Yes") {
        const orderValue = Number(valueInINR) || 0;
        if (
          typeof rc.codCharge === "number" &&
          typeof rc.codPercent === "number"
        ) {
          const calculatedCodCharge = Math.max(
            rc.codCharge,
            orderValue * (rc.codPercent / 100)
          );
          codCharge += calculatedCodCharge;
        } else {
          console.error("COD charge or percentage is not properly defined.");
        }
      }

      const gstAmountForward = (
        (totalForwardCharge + codCharge) *
        (gstRate / 100)
      ).toFixed(2);
      const totalChargesForward = (
        totalForwardCharge +
        codCharge +
        (totalForwardCharge + codCharge) * (gstRate / 100)
      ).toFixed(2);

      const allRates = {
        courierServiceName: rc.courierServiceName,
        cod: codCharge,
        forward: {
          charges: totalForwardCharge,
          gst: gstAmountForward,
          finalCharges: totalChargesForward,
        },
      };

      ans.push(allRates);
      
    }
    return ans;
  } catch (error) {
    console.error("Error in Calculation:", error);
    throw new Error("Error in Calculation");
  }
}

module.exports = { calculateRate, calculateRateForService };
