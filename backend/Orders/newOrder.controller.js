const Order = require("../models/newOrder.model"); // Adjust the path to your model
const user = require("../models/User.model");
const pickAddress = require("../models/pickupAddress.model");
const receiveAddress = require("../models/deliveryAddress.model");
const Courier = require("../models/AllCourierSchema");
const CourierService = require("../models/CourierService.Schema");
const Plan = require("../models/Plan.model");
const { checkServiceabilityAll } = require("./shipment.controller");
const { calculateRateForService } = require("../Rate/calculateRateController");
const csv = require("csv-parser");
const fs = require("fs");
const { log } = require("console");
// Create a shipment
const newOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      receiverAddress,
      productDetails,
      packageDetails,
      paymentDetails,
    } = req.body;
    // console.log(req.body);

    // Validate request data
    if (
      !pickupAddress ||
      !receiverAddress ||
      !productDetails ||
      !packageDetails ||
      !paymentDetails
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["COD", "Prepaid"].includes(paymentDetails.method)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Generate a unique six-digit order ID
    let orderId;
    let isUnique = false;

    while (!isUnique) {
      orderId = Math.floor(100000 + Math.random() * 900000); // Generates a random six-digit number
      const existingOrder = await Order.findOne({ orderId });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    const pickup = new pickAddress({
      userId: req.user._id,
      pickupAddress,
    });
    await pickup.save();

    const receiver = new receiveAddress({
      userId: req.user._id,
      receiverAddress,
    });
    await receiver.save();

    // Create a new shipment
    const shipment = new Order({
      userId: req.user._id,
      orderId, // Store the generated order ID
      pickupAddress,
      receiverAddress,
      productDetails,
      packageDetails,
      paymentDetails,
      status: "new",
    });

    // Save to the database
    await shipment.save();

    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// new pick up address
// const newPickupAddress=async(req,res)=>{
// try {
//   const pickup = new pickAddress({
//     userId: req.user._id,
//     // pickupAddress,
//   });

// } catch (error) {

// }
// }
// const newReciveAddress=async(req,res)=>{

// }
const getOrders = async (req, res) => {
  try {
    // console.log(req.user._id)
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getpickupAddress = async (req, res) => {
  try {
    const pickup = await pickAddress.find({ userId: req.user._id });
    res.json(pickup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getreceiverAddress = async (req, res) => {
  try {
    const receiver = await receiveAddress.find({ userId: req.user._id });
    res.json(receiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const ShipeNowOrder = async (req, res) => {
  // console.log("hii");

  try {
    // Fetch order by ID
    // console.log(req.params.id);

    const order = await Order.findById(req.params.id);

    //  console.log("dsfdsfdsfs",order.userId);

    const plan = await Plan.findOne({ userId: order.userId });
    // console.log(plan.planName)
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch enabled courier services
    const services = await CourierService.find({ status: "Enable" });

    const enabledServices = [];

    for await (const srvc of services) {
      const provider = await Courier.findOne({
        courierProvider: srvc.provider,
      });
      // console.log(provider);

      if (provider?.status === "Enable") {
        enabledServices.push(srvc);
      }
    }
    // console.log(enabledServices);

    const availableServices = await Promise.all(
      enabledServices.map(async (item) => {
        let result = await checkServiceabilityAll(
          item,
          order._id,
          order.pickupAddress.pinCode
        );
      
        if (result.success) {
          return{
            item,
            Xid:result.Xpressbeesid
          } ;
        
        }
      })
    );
 
    const filteredServices = availableServices.filter(Boolean);
    // console.log("oooooooooiou",availableServices)
    

    // console.log("filteredServices", filteredServices);
    const payload = {
      pickupPincode: order.pickupAddress.pinCode,
      deliveryPincode: order.receiverAddress.pinCode,
      length: order.packageDetails.volumetricWeight.length,
      breadth: order.packageDetails.volumetricWeight.width,
      height: order.packageDetails.volumetricWeight.height,
      weight: order.packageDetails.applicableWeight,
      cod: order.paymentDetails.method === "COD" ? "Yes" : "No",
      valueInINR: order.paymentDetails.amount,
      filteredServices,
      rateCardType: plan.planName,
    };
    // console.log("adsdasd",filteredServices)
    // console.log(payload)
    let rates = await calculateRateForService(payload);
    // console.log("rates", rates);

    const updatedRates = rates.map((rate) => {
      const matchedService = filteredServices.find(
        (service) => service.item.name === rate.courierServiceName
      );
      if (matchedService) {
        return {
          ...rate,
          provider: matchedService.item.provider,
          courierType: matchedService.item.courierType,
          Xid:matchedService.Xid[0]
        };
      }
      return rate;
    });
    res.status(201).json({
      success: true,
      order,
      services: filteredServices,
      updatedRates,
    });
    // console.log(availableServices);

    // Respond with order and available courier services
    // res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const pincodeData = [];

fs.createReadStream("data/pincodes.csv")
  .pipe(csv())
  .on("data", (row) => {
    pincodeData.push(row);
    // console.log(row)
  })
  .on("end", () => {
    console.log("CSV file successfully loaded.");
  });

const getPinCodeDetails = async (req, res) => {
  const { pincode } = req.params;
  // console.log(pincode);
  const foundEntry = pincodeData.find((entry) => entry.pincode === pincode);
  // console.log(pincodeData)

  if (foundEntry) {
    res.json({ city: foundEntry.city, state: foundEntry.state });
  } else {
    res.status(404).json({ error: "Pincode not found" });
  }
};
module.exports = {
  newOrder,
  getOrders,
  getpickupAddress,
  getreceiverAddress,
  ShipeNowOrder,
  getPinCodeDetails,
};
