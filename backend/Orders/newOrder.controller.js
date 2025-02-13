const Order = require("../models/newOrder.model"); // Adjust the path to your model
const user = require("../models/User.model");
const pickAddress = require("../models/pickupAddress.model");
const receiveAddress = require("../models/deliveryAddress.model");
const Courier = require("../models/AllCourierSchema");
const CourierService = require("../models/CourierService.Schema");
const Plan = require("../models/Plan.model");
const {
  pickup,
  cancelShipmentXpressBees,
  trackShipment,
} = require("../AllCouriers/Xpressbees/MainServices/mainServices.controller");
const { checkServiceabilityAll } = require("./shipment.controller");
const { calculateRateForService } = require("../Rate/calculateRateController");
const csv = require("csv-parser");
const fs = require("fs");
const { log } = require("console");
const { message } = require("../addons/utils/shippingRulesValidation");
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


const getOrdersById = async (req, res) => {
  const { id } = req.params;  // Correct destructuring

  console.log("Received ID:", id);

  try {
    const order = await Order.findById(id); // Correct findById usage

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(order);
    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatedStatusOrders = async (req, res) => {
  try {
    // console.log(req.body.id);
    
    // Ensure order ID is provided
    if (!req.body) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      {_id:req.body.id},
      { $set: { status: "new" } },
      { new: true } // Return the updated order
    );

    // If order not found
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Respond with updated order
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
        // log(result)

        if (result.success) {
          return {
            item,
            Xid: result.Xpressbeesid,
          };
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
          Xid: matchedService.Xid[0],
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

const cancelOrdersAtNotShipped = async (req, res) => {
  const orderData = req.body;
  try {
    const currentOrder = await Order.findById({ _id: orderId._id });

    if (currentOrder && currentOrder.status !== "Cancelled") {
      currentOrder.status = "Cancelled";
      return currentOrder.save();
    }
    res.status(201).send({ message });
  } catch (error) {
    console.error("Error canceling orders:", {
      // error,
      // orders: ordersToBeCancelled.map((order) => order._id),
    });
    res
      .status(500)
      .send({ error: "An error occurred while cancelling orders." });
  }
};
const cancelOrdersAtBooked = async (req, res) => {
  const allOrders = req.body;
  const walletId = req.body.walletId;
  try {
    // const currentWallet = await Wallet.findById(walletId);

    const currentOrder = await Order.findById({ _id: allOrders._id });
    if (currentOrder.provider === "Xpressbees") {
      const result = await cancelShipmentXpressBees(currentOrder.awb_number);
      console.log("dsadsads",result)
      if (result.error) {
        return {
          error: "Failed to cancel shipment with Xpressbees",
          details: result,
          orderId: currentOrder._id,
        };
      } else {
        currentOrder.status = "new";
      }
    } else if (
      currentOrder.service_details.courierProviderName === "Shiprocket"
    ) {
      const result = await cancelOrder(currentOrder.awb_number);
      if (!result.success) {
        return {
          error: "Failed to cancel shipment with Shiprocket",
          details: result,
          orderId: currentOrder._id,
        };
      } else if (
        currentOrder.service_details.courierProviderName === "Nimuspost"
      ) {
        const result = await cancelShipmentXpressBees(currentOrder.awb_number);
        if (result.error) {
          return {
            error: "Failed to cancel shipment with NimbusPost",
            details: result,
            orderId: currentOrder._id,
          };
        }
      }
    } else if (
      currentOrder.service_details.courierProviderName === "Delhivery"
    ) {
      // console.log("I am in it");
      const result = await cancelOrderDelhivery(currentOrder.awb_number);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with NimbusPost",
          details: result,
          orderId: currentOrder._id,
        };
      }
    } else if (
      currentOrder.service_details.courierProviderName === "ShreeMaruti"
    ) {
      const result = await cancelOrderShreeMaruti(currentOrder.order_id);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with NimbusPost",
          details: result,
          orderId: currentOrder._id,
        };
      }
    } else {
      return {
        error: "Unsupported courier provider",
        orderId: currentOrder._id,
      };
    }

    // currentOrder.status = "Not-Shipped";
    // currentOrder.cancelledAtStage = "Booked";
    // currentOrder.tracking.push({
    //   stage: "Cancelled",
    // });
    // let balanceTobeAdded = currentOrder.freightCharges;
    // let currentBalance = currentWallet.balance + balanceTobeAdded;

    // await currentWallet.updateOne({
    //   $inc: { balance: balanceTobeAdded },
    //   $push: {
    //     transactions: {
    //       txnType: "Shipping",
    //       action: "credit",
    //       amount: currentBalance,
    //       balanceAfterTransaction: currentWallet.balance + balanceTobeAdded,
    //       awb_number: `${currentOrder.awb_number}`,
    //     },
    //   },
    // });
    // currentOrder.freightCharges = 0;
    // await currentOrder.save();
    // await currentWallet.save();

    // return {
    //   message: "Order cancelled successfully",
    //   orderId: currentOrder._id,
    // };
    // })
    // );

    // let successCount = 0;
    // let failureCount = 0;
    // cancellationResults.forEach((result) => {
    //   if (result.error) {
    //     failureCount++;
    //   } else {
    //     successCount++;
    //   }
    // });

    res.status(201).send({
      // results: cancellationResults,
      // successCount,
      // failureCount,
      success:true
    });
  } catch (error) {
    console.error("Error cancelling orders:", error);
    res
      .status(500)
      .send({ error: "An error occurred while cancelling orders." });
  }
};

module.exports = {
  newOrder,
  getOrders,
  updatedStatusOrders,
  getOrdersById,
  getpickupAddress,
  getreceiverAddress,
  ShipeNowOrder,
  getPinCodeDetails,
  cancelOrdersAtNotShipped,
  cancelOrdersAtBooked,
};
