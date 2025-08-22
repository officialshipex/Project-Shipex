const Joi = require("joi");
const zoneManagementController = require("../../Rate/zoneManagementController");
const getZone = zoneManagementController.getZone;
const Plan = require("../../models/Plan.model");
const Order = require("../../models/newOrder.model"); // ✅ import Order model
const {
  checkServiceabilityEcomExpress,
} = require("../../AllCouriers/EcomExpress/Couriers/couriers.controllers.js");
const {
  checkPincodeServiceabilityDelhivery,
} = require("../../AllCouriers/Delhivery/Courier/couriers.controller.js");
const {
  checkServiceabilityDTDC,
} = require("../../AllCouriers/DTDC/Courier/couriers.controller.js");
const {
  checkSmartshipHubServiceability,
} = require("../../AllCouriers/SmartShip/Couriers/couriers.controller.js");
const {
  checkAmazonServiceability,
} = require("../../AllCouriers/Amazon/Courier/couriers.controller.js");

// Define courier IDs for each provider
const courierIds = {
  EcomExpress: "01",
  Delhivery: "02",
  DTDC: "03",
  Smartship: "04",
  Amazon: "05",
};

// Input Validation Schema
const serviceabilitySchema = Joi.object({
  orderId: Joi.string().trim().required(),
});

const availableCourierService = async (req, res) => {
  // 1. Validate orderId
  const { error, value } = serviceabilitySchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "failure",
      message: "Invalid request data",
      errors: error.details.map((d) => d.message),
    });
  }

  const { orderId } = value;

  try {
    const id = req.user._id;

    // 2. Fetch Order from DB
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        status: "failure",
        message: "Order not found.",
      });
    }

    // ✅ Extract required fields from DB order
    const pickUpPincode = order.pickupAddress.pinCode;
    const deliveryPincode = order.receiverAddress.pinCode;
    const applicableWeight = order.packageDetails.applicableWeight;
    const paymentType = order.paymentDetails.paymentType; // "COD" or "Prepaid"
    const declaredValue = order.paymentDetails.amount;

    // 3. Get Zone
    const result = await getZone(pickUpPincode, deliveryPincode);
    if (!result || !result.zone) {
      return res.status(400).json({
        status: "failure",
        message: "Could not determine zone for given pincodes.",
      });
    }
    const currentZone = result.zone;

    // 4. Get Plan / RateCards for user
    const plan = await Plan.findOne({ userId: id });
    if (!plan || !plan.rateCard) {
      return res.status(500).json({
        status: "failure",
        message: "No rate cards available for this user.",
      });
    }
    const rateCards = plan.rateCard;
    const order_type = paymentType === "COD" ? "cod" : "prepaid";
    const chargedWeight = applicableWeight * 1000; // grams
    const gst = 18;
    let ans = [];

    // 5. Loop through rateCards & calculate serviceability + charges
    for (let rc of rateCards) {
      const provider = rc.courierProviderName;
      if (!Object.keys(courierIds).includes(provider)) continue;

      let serviceable = false;

      if (provider === "Amazon") {
        const weight = order.packageDetails?.applicableWeight * 1000;

        const payload = {
          origin: order.pickupAddress,
          destination: order.receiverAddress,
          payment_type: order.paymentDetails?.method,
          order_amount: order.paymentDetails?.amount || 0,
          weight: weight || 0,
          length: order.packageDetails.volumetricWeight?.length || 0,
          breadth: order.packageDetails.volumetricWeight?.width || 0,
          height: order.packageDetails.volumetricWeight?.height || 0,
          productDetails: order.productDetails,
          orderId: order.orderId,
        };

        const { rate, requestToken, valueAddedServiceIds } =
          await checkAmazonServiceability("Amazon", payload);

        if (rate && requestToken) {
          serviceable = true;
        } else {
          serviceable = false;
        }
      } else if (provider === "EcomExpress") {
        serviceable = await checkServiceabilityEcomExpress(
          pickUpPincode,
          deliveryPincode
        );
      } else if (provider === "Delhivery") {
        serviceable = await checkPincodeServiceabilityDelhivery(
          deliveryPincode,
          order_type
        );
      } else if (provider === "DTDC") {
        serviceable = await checkServiceabilityDTDC(
          pickUpPincode,
          deliveryPincode
        );
      } else if (provider === "Smartship") {
        const payload = {
          source_pincode: pickUpPincode,
          destination_pincode: deliveryPincode,
          order_weight: applicableWeight,
          order_value: declaredValue,
        };
        serviceable = await checkSmartshipHubServiceability(payload);
      }

      if (!serviceable || serviceable.success === false) continue;

      // ✅ Charges calculation
      let basicCharge = parseFloat(rc.weightPriceBasic[0][currentZone]);
      let additionalCharge = parseFloat(
        rc.weightPriceAdditional[0][currentZone]
      );
      const count = Math.ceil(
        (chargedWeight - rc.weightPriceBasic[0].weight) /
          rc.weightPriceAdditional[0].weight
      );
      let finalCharge =
        rc.weightPriceBasic[0].weight >= chargedWeight
          ? basicCharge
          : basicCharge + additionalCharge * count;

      // COD calculation
      let cod = 0;
      if (paymentType === "COD") {
        const orderValue = Number(declaredValue) || 0;
        if (
          typeof rc.codCharge === "number" &&
          typeof rc.codPercent === "number"
        ) {
          cod = Math.max(rc.codCharge, orderValue * (rc.codPercent / 100));
        }
      }

      // GST + Final Total
      let gstAmount = Number(((finalCharge + cod) * gst) / 100).toFixed(2);
      let totalCharges = Math.round(finalCharge + cod + parseFloat(gstAmount));

      ans.push({
        courierServiceName: rc.courierServiceName,
        courierId: courierIds[provider],
        codCharges: cod,
        forward: {
          charges: Number(finalCharge.toFixed(2)),
          gst: Number(gstAmount),
          finalCharges: totalCharges,
        },
        serviceable: true,
      });
    }

    // ✅ Response
    if (ans.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No suitable service providers available for this order.",
        data: [],
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Rate calculation successful.",
      data: ans,
    });
  } catch (err) {
    console.error("Error in Public Rate Calculation:", err);
    return res.status(500).json({
      status: "failure",
      message: "An unexpected error occurred during rate calculation.",
      error: err.message,
    });
  }
};

module.exports = availableCourierService;
