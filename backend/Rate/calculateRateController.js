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
    const plan = await Plan.findOne({ userId: id });

    let rateCards = plan.rateCard;

    let ans = [];
    const chargedWeight = req.body.applicableWeight * 1000;

    let gst = 18;
    let provider;
    let mode;
    for (let rc of rateCards) {
      provider = rc.courierProviderName;
      mode = rc.mode;
      let basicChargef = parseFloat(rc.weightPriceBasic[0][currentZone]);
      let additionalChargef = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );

      let finalChargef;
      const count = Math.ceil(
        (chargedWeight - rc.weightPriceBasic[0].weight) /
          rc.weightPriceAdditional[0].weight
      );
      if (rc.weightPriceBasic[0].weight >= chargedWeight) {
        finalChargef = basicChargef;
      } else if (rc.weightPriceBasic[0].weight < chargedWeight) {
        finalChargef = basicChargef + additionalChargef * count;
      }
      let cod = 0;
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
      // console.log("22222200",cod)
      let gstAmountf = (finalChargef + cod) * (gst / 100).toFixed(2);
      let totchargesf = Math.round(finalChargef + cod + gstAmountf);

      let allRates = {};
      allRates.courierServiceName = rc.courierServiceName;
      allRates.cod = cod;
      allRates.provider = provider;
      allRates.mode = mode;
      allRates.forward = {
        charges: finalChargef,
        gst: gstAmountf,
        finalCharges: totchargesf,
      };

      ans.push(allRates);
    }
    // console.log("1111111111111111",ans)
    res.status(201).json(ans);
  } catch (error) {
    console.log("Error in Calculation");
    res.status(500).json({ error: "Error in Calculation" });
  }
};

async function calculateRateForService(payload) {
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
      userID,
      filteredServices,
      // rateCardType,
    } = payload;

    const result = await getZone(pickupPincode, deliveryPincode);

    const currentZone = result.zone;

    const ans = [];
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const deadweight = parseFloat(weight) / 1000;
    const volumetricWeight = (l * b * h) / 5000;
    const chargedWeight = weight * 1000;

    // let codCharge = 0;
    const gstRate = 18;

    // const rateCards = [];
    const plan = await Plan.findOne({ userId: userID });
    let RateCards = plan.rateCard;

    // for (rc of RateCards) {
    //   let currentRate = await RateCard.findOne({
    //     courierProviderName: fls.item.provider,
    //     courierServiceName: fls.item.name,
    //   });
    //   rateCards.push(currentRate);
    // }
    // const finalRate = rateCards.filter(Boolean);

    for (const rc of RateCards) {
      // const basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      // const additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);
      const basicChargeForward = parseFloat(
        rc.weightPriceBasic[0][currentZone]
      );
      const additionalChargeForward = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );

      let totalForwardCharge;
      const count = Math.ceil(
        (chargedWeight - rc.weightPriceBasic[0].weight) /
          rc.weightPriceAdditional[0].weight
      );
      if (rc.weightPriceBasic[0].weight >= chargedWeight) {
        totalForwardCharge = basicChargeForward;
      } else if (rc.weightPriceBasic[0].weight < chargedWeight) {
        totalForwardCharge =
          basicChargeForward + additionalChargeForward * count;
      }
      let codCharge = 0;
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
    // console.log("0000000", ans);
    return ans;
  } catch (error) {
    console.error("Error in Calculation:", error);
    throw new Error("Error in Calculation");
  }
}

async function calculateRateForDispute(payload) {
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
      userID,
      filteredServices,
      // rateCardType,
    } = payload;

    const result = await getZone(pickupPincode, deliveryPincode);

    const currentZone = result.zone;

    const ans = [];
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const deadweight = parseFloat(weight) / 1000;
    const volumetricWeight = (l * b * h) / 5000;
    const chargedWeight = weight * 1000;

    // let codCharge = 0;
    const gstRate = 18;

    // const rateCards = [];
    const plan = await Plan.findOne({ userId: userID });
    // console.log("palan",plan)
    let RateCards = plan.rateCard;

    const service = RateCards.filter((rate) => {
      return rate.courierServiceName === filteredServices;
    });
    

    console.log("serivi",service[0].weightPriceAdditional)

    for (const rc of service) {
      
      const basicChargeForward = parseFloat(
        rc.weightPriceBasic[0][currentZone]
      );
      const additionalChargeForward = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );
      console.log("addd",additionalChargeForward)

      let totalForwardCharge;
      const count = Math.ceil(
        (chargedWeight - rc.weightPriceBasic[0].weight) /
          rc.weightPriceAdditional[0].weight
      );
      // console.log("count",count)
      if (rc.weightPriceBasic[0].weight >= chargedWeight) {
        
        totalForwardCharge = basicChargeForward;
      } else if (rc.weightPriceBasic[0].weight < chargedWeight) {
        console.log("additi")
        totalForwardCharge =
          basicChargeForward + additionalChargeForward * count;
      }
      console.log("total",totalForwardCharge)
      let codCharge = 0;
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

      // console.log("cod",codCharge)

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
    // console.log("0000000", ans);
    return ans;
  } catch (error) {
    console.error("Error in Calculation:", error);
    throw new Error("Error in Calculation");
  }
}

async function calculateRateForServiceBulk(payload) {
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
      userID,
      filteredServices,
      // rateCardType,
    } = payload;
console.log("9999999999",filteredServices)
    const result = await getZone(pickupPincode, deliveryPincode);

    const currentZone = result.zone;

    const ans = [];
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const deadweight = parseFloat(weight) / 1000;
    const volumetricWeight = (l * b * h) / 5000;
    const chargedWeight = weight * 1000;

    // let codCharge = 0;
    const gstRate = 18;

    // const rateCards = [];
    const plan = await Plan.findOne({ userId: userID });
    let RateCards = plan.rateCard;

    // for (rc of RateCards) {
    //   let currentRate = await RateCard.findOne({
    //     courierProviderName: fls.item.provider,
    //     courierServiceName: fls.item.name,
    //   });
    //   rateCards.push(currentRate);
    // }
    // const finalRate = rateCards.filter(Boolean);

    for (const rc of RateCards) {
      // const basicWeight = parseFloat(rc.weightPriceBasic[0].weight);
      // const additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight);
     
  // if(rc.courierServiceName==){
      const basicChargeForward = parseFloat(
        rc.weightPriceBasic[0][currentZone]
      );
      const additionalChargeForward = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );

      let totalForwardCharge;
      const count = Math.ceil(
        (chargedWeight - rc.weightPriceBasic[0].weight) /
          rc.weightPriceAdditional[0].weight
      );
      if (rc.weightPriceBasic[0].weight >= chargedWeight) {
        totalForwardCharge = basicChargeForward;
      } else if (rc.weightPriceBasic[0].weight < chargedWeight) {
        totalForwardCharge =
          basicChargeForward + additionalChargeForward * count;
      }
      let codCharge = 0;
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
    // }
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
     if(allRates.courierServiceName===filteredServices.name){
      ans.push(allRates);
     }
      // ans.push(allRates);
    }
    // console.log("0000000", ans);
    return ans;
  } catch (error) {
    console.error("Error in Calculation:", error);
    throw new Error("Error in Calculation");
  }
}

module.exports = {
  calculateRate,
  calculateRateForService,
  calculateRateForServiceBulk,
  calculateRateForDispute
};
