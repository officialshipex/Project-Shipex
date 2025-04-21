const Order = require("../models/newOrder.model"); // Adjust the path to your model
const user = require("../models/User.model");
const pickAddress = require("../models/pickupAddress.model");
const receiveAddress = require("../models/deliveryAddress.model");
const Courier = require("../models/AllCourierSchema");
const CourierService = require("../models/CourierService.Schema");
const Plan = require("../models/Plan.model");
const Wallet = require("../models/wallet");
const Bottleneck = require("bottleneck");
const cron = require("node-cron");

const { codToBeRemitted } = require("../COD/cod.controller");
const {
  cancelShipmentforward,
  shipmentTrackingforward,
} = require("../AllCouriers/EcomExpress/Couriers/couriers.controllers");
const {
  pickup,
  cancelShipmentXpressBees,
  trackShipment,
} = require("../AllCouriers/Xpressbees/MainServices/mainServices.controller");
const {
  trackShipmentDelhivery,
} = require("../AllCouriers/Delhivery/Courier/couriers.controller");
const {
  cancelOrderDelhivery,
} = require("../AllCouriers/Delhivery/Courier/couriers.controller");
const {
  cancelShipment,
  getShipmentTracking,
} = require("../AllCouriers/Amazon/Courier/couriers.controller");
const {
  cancelOrderShreeMaruti,
  trackOrderShreeMaruti,
} = require("../AllCouriers/ShreeMaruti/Couriers/couriers.controller");
const { checkServiceabilityAll } = require("./shipment.controller");
const { calculateRateForService } = require("../Rate/calculateRateController");
const csv = require("csv-parser");
const fs = require("fs");
const { log } = require("console");
const { message } = require("../addons/utils/shippingRulesValidation");
const mongoose = require("mongoose");
const {
  cancelOrderDTDC,
  trackOrderDTDC,
} = require("../AllCouriers/DTDC/Courier/couriers.controller");
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
    // await pickup.save();

    const receiver = new receiveAddress({
      userId: req.user._id,
      receiverAddress,
    });
    // await receiver.save();

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
      tracking: [
        {
          title: "Created",
          descriptions: "Order created",
        },
      ],
    });

    // Save to the database
    await shipment.save();

    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    // console.log("1111111111",error)
    res.status(400).json({ error: "All fields are required" });
  }
};
// new pick up address

const newPickupAddress = async (req, res) => {
  try {
    // console.log(req.body); // To log the incoming request body

    // Create a new shipment instance, where pickupAddress is a sub-document
    const shipment = new pickAddress({
      userId: req.user._id, // Assuming req.user._id is populated via authentication middleware
      pickupAddress: {
        contactName: req.body.contactName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address || "", // Default to empty string if not provided
        pinCode: req.body.pinCode,
        city: req.body.city,
        state: req.body.state,
      },
    });

    // Save the shipment with the pickup address
    await shipment.save();

    res.status(201).json({
      success: true,
      message: "Pickup address saved successfully!",
      data: shipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while saving pickup address",
    });
  }
};

const newReciveAddress = async (req, res) => {
  try {
    // console.log(req.body); // To log the incoming request body

    // Create a new shipment instance, where receiverAddress is a sub-document
    const shipment = new receiveAddress({
      userId: req.user._id, // Assuming req.user._id is populated via authentication middleware
      receiverAddress: {
        contactName: req.body.contactName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address || "", // Default to empty string if not provided
        pinCode: req.body.pinCode,
        city: req.body.city,
        state: req.body.state,
      },
    });

    // console.log(shipment)

    // Save the shipment with the receiver address
    await shipment.save();

    res.status(201).json({
      success: true,
      message: "Receiver address saved successfully!",
      data: shipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while saving receiver address",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;
    const status = req.query.status;
    // console.log(status)

    const filter = { userId };
    if (status && status !== "All") {
      filter.status = status;
    }

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.skip(skip).limit(limit);

    const orders = await query.lean();
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    res.json({
      orders,
      totalPages,
      totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching paginated orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOrdersByNdrStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;
    const status = req.query.status;
    // console.log(status)

    const filter = { userId };
    if (status && status !== "All") {
      filter.ndrStatus = status;
    }

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter).sort({
      "ndrReason.date": -1,
      createdAt: -1,
    });

    if (limit) query = query.skip(skip).limit(limit);

    const orders = await query.lean();
    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    res.json({
      orders,
      totalPages,
      totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching paginated orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupAddress, receiverAddress, paymentDetails, packageDetails } =
      req.body;

    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid orderId format." });
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    //   if (!req.body.paymentDetails || !req.body.paymentDetails.amount) {
    //     return res.status(400).json({ error: "paymentDetails and amount are required" });
    // }
    // console.log(pickupAddress)

    const updateFields = {};

    // Update pickupAddress if provided
    if (pickupAddress) {
      updateFields.pickupAddress = {
        contactName:
          pickupAddress.contactName || existingOrder.pickupAddress.contactName,
        phoneNumber:
          pickupAddress.phoneNumber || existingOrder.pickupAddress.phoneNumber,
        email: pickupAddress.email || existingOrder.pickupAddress.email,
        address: pickupAddress.address || existingOrder.pickupAddress.address,
        city: pickupAddress.city || existingOrder.pickupAddress.city,
        state: pickupAddress.state || existingOrder.pickupAddress.state,
        pinCode: pickupAddress.pinCode || existingOrder.pickupAddress.pinCode,
      };
    }

    // Update receiverAddress if provided
    if (receiverAddress) {
      updateFields.receiverAddress = {
        contactName:
          receiverAddress.contactName ||
          existingOrder.receiverAddress.contactName,
        phoneNumber:
          receiverAddress.phoneNumber ||
          existingOrder.receiverAddress.phoneNumber,
        email: receiverAddress.email || existingOrder.receiverAddress.email,
        address:
          receiverAddress.address || existingOrder.receiverAddress.address,
        city: receiverAddress.city || existingOrder.receiverAddress.city,
        state: receiverAddress.state || existingOrder.receiverAddress.state,
        pinCode:
          receiverAddress.pinCode || existingOrder.receiverAddress.pinCode,
      };
    }

    // Ensure paymentDetails exist before updating
    if (paymentDetails) {
      updateFields.paymentDetails = {
        method: paymentDetails.method || existingOrder.paymentDetails.method,
        amount: paymentDetails.amount || existingOrder.paymentDetails.amount,
      };
    }

    // Ensure packageDetails exist before updating
    if (packageDetails) {
      updateFields.packageDetails = {
        deadWeight:
          packageDetails.deadWeight || existingOrder.packageDetails.deadWeight,
        applicableWeight:
          packageDetails.applicableWeight ||
          existingOrder.packageDetails.applicableWeight,
        volumetricWeight: {
          length:
            packageDetails.volumetricWeight?.length ||
            existingOrder.packageDetails.volumetricWeight.length,
          width:
            packageDetails.volumetricWeight?.width ||
            existingOrder.packageDetails.volumetricWeight.width,
          height:
            packageDetails.volumetricWeight?.height ||
            existingOrder.packageDetails.volumetricWeight.height,
        },
      };
    }

    // Update order in the database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getOrdersById = async (req, res) => {
  const { id } = req.params;
  // console.log("Received ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID format" });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await Order.findByIdAndUpdate(
      req.body.id,
      {
        $set: { status: "new" },
        $push: {
          tracking: {
            title: "Clone",
            descriptions: "Clone Order by user",
          },
        },
      },
      { new: true }
    );

    // If order not found
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Respond with updated order
    res.status(200).json({
      success: true,
      message: "Clone Order sucessfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getpickupAddress = async (req, res) => {
  try {
    const pickupAddresses = await pickAddress.find({ userId: req.user._id });

    if (!pickupAddresses.length) {
      return res.status(404).json({ message: "No pickup addresses found" });
    }

    res.status(200).json({ success: true, data: pickupAddresses });
  } catch (error) {
    console.error("Error fetching pickup addresses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getreceiverAddress = async (req, res) => {
  try {
    const receiverAddresses = await receiveAddress.find({
      userId: req.user._id,
    });

    if (!receiverAddresses.length) {
      return res
        .status(404)
        .json({ success: false, message: "No receiver addresses found" });
    }

    res.status(200).json({ success: true, data: receiverAddresses });
  } catch (error) {
    console.error("Error fetching receiver addresses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const ShipeNowOrder = async (req, res) => {
  try {
    // Fetch order by ID
    // console.log(req.params.id);

    const order = await Order.findById(req.params.id);

    //  console.log("dsfdsfdsfs",order.userId);

    const plan = await Plan.findOne({ userId: order.userId });
    const users = await user.findOne({ _id: order.userId });
    const userWallet = await Wallet.findOne({ _id: users.Wallet });
    // console.log("ahsaisa",userWallet)
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch enabled courier services
    const services = await CourierService.find({ status: "Enable" });
    // console.log("88888888888888888",services);
    const enabledServices = [];

    for await (const srvc of services) {
      const provider = await Courier.findOne({
        courierProvider: srvc.provider,
      });
      if (provider?.status === "Enable") {
        enabledServices.push(srvc);
      }
    }
    // console.log("enableservices", enabledServices);
    const availableServices = await Promise.all(
      enabledServices.map(async (item) => {
        let result = await checkServiceabilityAll(
          item,
          order._id,
          order.pickupAddress.pinCode
        );

        // console.log("iiiii", result);
        if (result && result.success) {
          return {
            item,
          };
        } else {
          console.error(
            "Result is undefined or does not have a success property"
          );
          // Handle the case where result is not as expected
        }
      })
    );
    // console.log("availbale",availableServices)

    const filteredServices = availableServices.filter(Boolean);
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
      userID: req.user._id,
      filteredServices,
      rateCardType: plan.planName,
    };
    let rates = await calculateRateForService(payload);
    // console.log("rates", rates);

    const updatedRates = rates
      .map((rate) => {
        const matchedService = filteredServices.find(
          (service) => service.item.name === rate.courierServiceName
        );
        // console.log("1111111", matchedService);

        if (matchedService) {
          return {
            ...rate,
            provider: matchedService.item.provider,
            courierType: matchedService.item.courierType,
            courier: matchedService.item?.courier,
            // Xid: matchedService.Xid[0],
          };
        }

        return null; // Return null for unmatched rates
      })
      .filter(Boolean); // Remove null values from the final array
    // console.log("update",updatedRates)
    res.status(201).json({
      success: true,
      order,
      services: filteredServices,
      updatedRates,
    });
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
  const { orderId } = req.body;
  // console.log(orderData)
  try {
    const currentOrder = await Order.findByIdAndDelete({ _id: orderId });

    res.status(201).json({ message: "Order delete successfully" });
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
  console.log(allOrders);
  try {
    const users = await user.findOne({ _id: allOrders.userId });
    // console.log(users)
    const currentWallet = await Wallet.findById({ _id: users.Wallet });

    const currentOrder = await Order.findById({ _id: allOrders._id });

    if (currentOrder.provider === "Xpressbees") {
      const result = await cancelShipmentXpressBees(currentOrder.awb_number);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with Xpressbees",
          details: result,
          orderId: currentOrder._id,
        };
      } else {
        currentOrder.status = "new";
      }
    } else if (currentOrder.provider === "Shiprocket") {
      const result = await cancelOrder(currentOrder.awb_number);
      if (!result.success) {
        return {
          error: "Failed to cancel shipment with Shiprocket",
          details: result,
          orderId: currentOrder._id,
        };
      } else if (currentOrder.provider === "Nimuspost") {
        const result = await cancelShipmentXpressBees(currentOrder.awb_number);
        if (result.error) {
          return {
            error: "Failed to cancel shipment with NimbusPost",
            details: result,
            orderId: currentOrder._id,
          };
        }
      }
    } else if (currentOrder.provider === "Delhivery") {
      // console.log("I am in it");
      const result = await cancelOrderDelhivery(currentOrder.awb_number);

      if (result.error) {
        return res.status(400).json({
          error: result?.error || "Failed to cancel shipment with Delhivery",
          details: result,
          orderId: currentOrder._id,
        });
      } else {
        currentOrder.status = "new";
      }
    } else if (currentOrder.provider === "ShreeMaruti") {
      const result = await cancelOrderShreeMaruti(currentOrder.orderId);
      // console.log("shreemaruti",result)
      if (result.error) {
        // console.log("shree",result)
        return res.status(400).json({
          error: "Failed to cancel shipment with ShreeMaruti",
          details: result,
          orderId: currentOrder._id,
        });
      } else {
        currentOrder.status = "new";
      }
    } else if (currentOrder.provider === "DTDC") {
      const result = await cancelOrderDTDC(currentOrder.awb_number);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with DTDC",
          details: result,
          orderId: currentOrder._id,
        };
      }
    } else if (currentOrder.provider === "EcomExpress") {
      const result = await cancelShipmentforward(currentOrder.awb_number);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with EcomExpress",
          details: result,
          orderId: currentOrder._id,
        };
      }
    } else if (currentOrder.provider === "Amazon") {
      const result = await cancelShipment(currentOrder.shipment_id);
      if (result.error) {
        return {
          error: "Failed to cancel shipment with Amazon",
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
    currentOrder.tracking.push({
      title: "Cancelled",
      descriptions: `Cancelled Order by user`,
    });
    let balanceTobeAdded =
      allOrders.totalFreightCharges == "N/A"
        ? 0
        : parseInt(allOrders.totalFreightCharges);
    await currentWallet.updateOne({
      $inc: { balance: balanceTobeAdded },
      $push: {
        transactions: {
          channelOrderId: currentOrder.orderId || null, // Include if available
          category: "credit",
          amount: balanceTobeAdded, // Fixing incorrect reference
          balanceAfterTransaction: currentWallet.balance + balanceTobeAdded,
          date: new Date().toISOString().slice(0, 16).replace("T", " "), // Format date & time
          awb_number: allOrders.awb_number || "", // Ensuring it follows the schema
          description: `Freight Chages Received`,
        },
      },
    });
    // console.log("hii")
    res.status(201).send({
      success: true,
    });
  } catch (error) {
    console.error("Error cancelling orders:", error);
    res
      .status(500)
      .send({ error: "An error occurred while cancelling orders." });
  }
};

const limiter = new Bottleneck({
  minTime: 1000, // 10 requests per second (1000ms delay between each)
  maxConcurrent: 10, // Maximum 10 at the same time
  reservoir: 750, // Max 750 calls per minute
  reservoirRefreshAmount: 750,
  reservoirRefreshInterval: 60 * 1000, // Refresh every 1 minute
});

const trackSingleOrder = async (order) => {
  try {
    // console.log("Tracking order:", order.orderId);
    const { provider, awb_number } = order;
    if (!provider || !awb_number) return;

    const trackingFunctions = {
      Xpressbees: trackShipment,
      Delhivery: trackShipmentDelhivery,
      ShreeMaruti: trackOrderShreeMaruti,
      DTDC: trackOrderDTDC,
      EcomExpress: shipmentTrackingforward,
      Amazon: getShipmentTracking,
    };

    if (!trackingFunctions[provider]) {
      console.warn(`Unknown provider: ${provider} for Order ID: ${order._id}`);
      return;
    }

    const result = await trackingFunctions[provider](awb_number);
    if (!result || !result.success || !result.data) return;

    const normalizedData = mapTrackingResponse(result.data, provider);
    if (!normalizedData) {
      console.warn(`Failed to map tracking data for AWB: ${awb_number}`);
      return;
    }

    if (provider === "EcomExpress") {
      const ecomExpressStatusMapping = {
        "soft data uploaded": "Ready To Ship",
        "pickup assigned": "In-transit",
        "out for pickup": "In-transit",
        "pickup failed": "Ready To Ship",
        "pickup scheduled": "Ready To Ship",
        "field pickup done": "In-transit",
        bagged: "In-transit",
        "bag added to connection": "In-transit",
        "departed from location": "In-transit",
        "redirected to another": "In-transit",
        "bag inscan at location": "In-transit",
        "origin facility inscan": "In-transit",
        "shipment inscan at location": "In-transit",
        "shipment debagged at location": "In-transit",
        "redirected to another delivery center (dc update)": "In-transit",
        "out for delivery": "Out for Delivery",
        undelivered: "Undelivered",
        "mass update": "Undelivered",
        delivered: "Delivered",
        "arrived at destination": "In-transit",
        "ofd lock": "RTO",
        "rto lock": "RTO",
        returned: "RTO In-transit",
        cancelled: "Cancelled",
        lost: "Cancelled",
        // undelivered: "In-transit",
        "not picked": "Ready To Ship",
      };

      const instruction = normalizedData.Instructions?.toLowerCase();
      order.status = ecomExpressStatusMapping[instruction];

      if (ecomExpressStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }
      console.log("rew", result);
      // ✅ Update AWB if it's an RTO and ref_awb exists
      if (order.status === "RTO In-transit" && result.rto_awb) {
        order.awb_number = result.rto_awb;
      } else {
        order.awb_number = result.data.awb_number;
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        (instruction === "bagged" ||
          instruction === "bag added to connection" ||
          instruction === "departed from location" ||
          instruction === "bag inscan at location" ||
          instruction === "shipment debagged at location")
      ) {
        order.status = "RTO In-transit";
        order.ndrStatus = "RTO In-transit";
      }

      if (instruction === "undelivered" && order.ndrStatus!=="Action_Requested") {
        order.ndrStatus = "Undelivered";
        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.ReasonCode,
        };
        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.date
        ).toDateString();
        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          order.ndrHistory.length === 0 ||
          lastEntryDate !== currentStatusDate
        ) {
          if (!Array.isArray(order.ndrHistory)) {
            order.ndrHistory = [];
          }

          const attemptCount = order.ndrHistory?.length || 0;
          if (instruction === "undelivered") {
            // console.log("sta",instruction)
            order.ndrHistory.push({
              date: normalizedData.StatusDateTime,
              action: "Auto Reattempt",
              remark: normalizedData.ReasonCode,
              attempt: attemptCount + 1,
            });
          }
        }
      }
      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        instruction === "out for delivery"
      ) {
        order.status = "RTO Out for Delivery";
        order.ndrStatus = "RTO Out for Delivery";
      }
      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        instruction === "delivered"
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }
    }
    if (provider === "DTDC") {
      const DTDCStatusMapping = {
        "order received": "Ready To Ship",
        "pickup failed": "Ready To Ship",
        "pickup awaited": "Ready To Ship",
        "softdata upload": "Ready To Ship",
        "pickup scheduled": "Ready To Ship",
        "not picked": "Ready To Ship",
        "pickup reassigned": "Ready To Ship",
        "picked up": "In-transit",
        booked: "In-transit",
        "in transit": "In-transit",
        "reached at destination": "In-transit",
        "mis route": "In-transit",
        "fdm prepared": "In-transit",
        "wrong pincode": "In-transit",
        "waiting for rto approval": "In-transit",
        "non serviceable location": "In-transit",
        "disturbed/ prohibited area": "In-transit",
        "e-waybill dispute": "In-transit",
        "shipment received after cut-off time at destination": "In-transit",
        "off-loaded by airlines (central team access)": "In-transit",
        "weekly off": "In-transit",
        "stock scan": "In-transit",
        "out for delivery": "Out for Delivery",
        "otp based delivered": "Delivered",
        delivered: "Delivered",
        "not delivered": "Undelivered",
        "rto processed & forwarded": "RTO",
        "rto booked": "RTO",
        "rto in transit": "RTO In-transit",
        "rto reached at destination": "RTO In-transit",
        "rto delivered": "RTO Delivered",
      };

      const instruction = normalizedData.Instructions?.toLowerCase();
      order.status = DTDCStatusMapping[instruction];

      if (order.status === "RTO") {
        order.ndrStatus = "RTO";
      }
      if (order.status === "RTO In-transit") {
        order.ndrStatus = "RTO In-transit";
      }

      if (DTDCStatusMapping[instruction] === "Out for Delivery") {
        order.ndrStatus = "Out for Delivery";
      }

      if (
        instruction === "not delivered" &&
        order.ndrStatus !== "Action_Requested"
      ) {
        order.status = "Undelivered";
        order.ndrStatus = "Undelivered";
        order.ndrReason = {
          date: normalizedData.StatusDateTime,
          reason: normalizedData.StrRemarks,
        };
        const lastEntryDate = new Date(
          order.ndrHistory[order.ndrHistory.length - 1]?.date
        ).toDateString();
        const currentStatusDate = new Date(
          normalizedData.StatusDateTime
        ).toDateString();

        if (
          order.ndrHistory.length === 0 ||
          lastEntryDate !== currentStatusDate
        ) {
          if (!Array.isArray(order.ndrHistory)) {
            order.ndrHistory = [];
          }
          const attemptCount = order.ndrHistory?.length || 0;
          if (instruction === "not delivered") {
            order.ndrHistory.push({
              date: normalizedData.StatusDateTime,
              action: "Auto Reattempt",
              remark: normalizedData.StrRemarks,
              attempt: attemptCount + 1,
            });
          }
        }
      }

      if (
        (order.status === "RTO" || order.status === "RTO In-transit") &&
        instruction === "rto delivered"
      ) {
        order.status = "RTO Delivered";
        order.ndrStatus = "RTO Delivered";
      }
      if (
        instruction === "delivered" ||
        instruction === "otp based delivered"
      ) {
        order.status = "Delivered";
        order.ndrStatus = "Delivered";
      }
    }
    if (provider === "Amazon") {
      if (normalizedData.ShipmentType === "FORWARD") {
        if (normalizedData.Instructions === "ReadyForReceive") {
          order.status = "Ready To Ship";
        }
        if (
          normalizedData.Instructions === "PickupDone" ||
          normalizedData.Instructions === "ArrivedAtCarrierFacility" ||
          normalizedData.Instructions === "Departed"
        ) {
          order.status = "In-transit";
        }
        if (normalizedData.Instructions === "OutForDelivery") {
          order.status = "Out for Delivery";
          order.ndrStatus = "Out for Delivery";
        }
        if (
          normalizedData.Instructions === "DeliveryAttempted" &&
          order.ndrStatus !== "Action_Requested"
        ) {
          order.status = "Undelivered";
          order.ndrStatus = "Undelivered";
          order.ndrReason = {
            date: normalizedData.StatusDateTime,
            reason: normalizedData.Instructions,
          };
          const lastEntryDate = new Date(
            order.ndrHistory[order.ndrHistory.length - 1]?.date
          ).toDateString();
          const currentStatusDate = new Date(
            normalizedData.StatusDateTime
          ).toDateString();

          if (
            order.ndrHistory.length === 0 ||
            lastEntryDate !== currentStatusDate
          ) {
            if (!Array.isArray(order.ndrHistory)) {
              order.ndrHistory = [];
            }
            const attemptCount = order.ndrHistory?.length || 0;
            if (normalizedData.Instructions === "DeliveryAttempted") {
              order.ndrHistory.push({
                date: normalizedData.StatusDateTime,
                action: "Auto Reattempt",
                remark: normalizedData.Instructions,
                attempt: attemptCount + 1,
              });
            }
          }
        }
      } else {
        if (
          normalizedData.Instructions === "ReturnInitiated" &&
          order.status === "Undelivered"
        ) {
          order.status = "RTO";
          order.ndrStatus = "RTO";
        }
        if (
          normalizedData.Instructions === "ArrivedAtCarrierFacility" ||
          normalizedData.Instructions === "Departed" ||
          normalizedData.Instructions ===
            "Package arrived at the carrier facility" ||
          normalizedData.Instructions ===
            "Package has left the carrier facility"
        ) {
          order.status = "RTO In-transit";
          order.ndrStatus = "RTO In-transit";
        }
        if (normalizedData.Instructions === "ReturnInitiated") {
          order.status = "RTO In-transit";
        }
        if (normalizedData.Instructions === "OutForDelivery") {
          order.status = "RTO Out for Delivery";
        }
        if (normalizedData.Instructions === "Delivered") {
          order.status = "RTO Delivered";
          order.ndrStatus = "RTO Delivered";
        }
      }
    } else {
      const statusMap = {
        "UD:Manifested": { status: "Ready To Ship" },
        "UD:In Transit": { status: "In-transit" },
        "UD:Dispatched": { status: "Out for Delivery",ndrStatus:"Out for Delivery" },
        "RT:In Transit": {
          status: "RTO In-transit",
          ndrStatus: "RTO In-transit",
        },
        "DL:RTO": { status: "RTO Delivered", ndrStatus: "RTO Delivered" },
        "DL:Delivered": { status: "Delivered" },
      };

      const key = `${normalizedData.StatusType}:${normalizedData.Status}`;
      const mapped = statusMap[key];

      if (mapped) {
        order.status = mapped.status;
        if (mapped.ndrStatus) order.ndrStatus = mapped.ndrStatus;
      } else if (
        normalizedData.StatusType === "UD" &&
        normalizedData.Status === "Pending" &&
        normalizedData.StatusCode === "ST-108"
      ) {
        order.status = "RTO";
      }

      const eligibleNSLCodes = [
        "EOD-74",
        "EOD-15",
        "EOD-104",
        "EOD-43",
        "EOD-86",
        "EOD-11",
        "EOD-69",
        "EOD-6",
      ];

      const lastEntryDate = new Date(
        order.ndrHistory[order.ndrHistory.length - 1]?.date
      ).toDateString();
      const currentStatusDate = new Date(
        normalizedData.StatusDateTime
      ).toDateString();
      if (!Array.isArray(order.ndrHistory)) {
        order.ndrHistory = [];
      }
      if (
        order.ndrHistory.length === 0 ||
        lastEntryDate !== currentStatusDate
      ) {
        if (
          normalizedData.StatusCode &&
          eligibleNSLCodes.includes(normalizedData.StatusCode)
        ) {
          order.ndrStatus = "Undelivered";
          order.status = "Undelivered";
          order.ndrReason = {
            date: normalizedData.StatusDateTime,
            reason: normalizedData.Instructions,
          };
        }
        const attemptCount = order.ndrHistory?.length || 0;
        order.ndrHistory.push({
          date: normalizedData.StatusDateTime,
          action: "Auto Reattempt",
          remark: normalizedData.Instructions,
          attempt: attemptCount + 1,
        });
      }
    }

    const lastTrackingEntry = order.tracking[order.tracking.length - 1];

    const isSameCheckpoint =
      lastTrackingEntry &&
      lastTrackingEntry.StatusLocation === normalizedData.StatusLocation &&
      new Date(lastTrackingEntry.StatusDateTime).getTime() ===
        new Date(normalizedData.StatusDateTime).getTime();

    if (isSameCheckpoint) {
      // Just update the last entry if the checkpoint is the same
      lastTrackingEntry.status = normalizedData.Status;
      lastTrackingEntry.Instructions = normalizedData.Instructions;
    } else if (
      !lastTrackingEntry ||
      lastTrackingEntry.Instructions !== normalizedData.Instructions
    ) {
      // It's a new checkpoint, so push it
      order.tracking.push({
        status: normalizedData.Status,
        StatusLocation: normalizedData.StatusLocation,
        StatusDateTime: normalizedData.StatusDateTime,
        Instructions: normalizedData.Instructions,
      });
    }

    await order.save();
  } catch (error) {
    console.error(
      `Error tracking order ID: ${order._id}, AWB: ${order.awb_number} ${error}`
    );
  }
};

// Main controller
const trackOrders = async () => {
  try {
    const pLimit = await import("p-limit").then((mod) => mod.default);
    const limit = pLimit(10); // Max 10 concurrent executions

    const allOrders = await Order.find({
      status: { $nin: ["new", "Cancelled", "Delivered", "RTO Delivered"] },
    });

    console.log(`📦 Found ${allOrders.length} orders to track`);

    const limitedTrack = limiter.wrap(trackSingleOrder); // apply rate limiter

    const trackingPromises = allOrders.map(
      (order) => limit(() => limitedTrack(order)) // limit concurrency
    );

    await Promise.all(trackingPromises);

    console.log("✅ All tracking updates completed");
  } catch (error) {
    console.error("❌ Error in tracking orders:", error);
  }
};

const startTrackingLoop = async () => {
  try {
    console.log("🕒 Starting Order Tracking");
    await trackOrders();
    console.log("⏳ Waiting for 5 minutes before next tracking cycle...");
    setTimeout(startTrackingLoop, 5 * 60 * 1000); // Wait 5 minutes, then call again
  } catch (error) {
    console.error("❌ Error in tracking loop:", error);
    setTimeout(startTrackingLoop, 5 * 60 * 1000); // Retry after 5 minutes even on error
  }
};

startTrackingLoop();

const mapTrackingResponse = (data, provider) => {
  const providerMappings = {
    EcomExpress: {
      Status: data.reason_code_description || "N/A",
      StatusLocation: data.current_location_name || "N/A",
      StatusDateTime: data.last_update_datetime || null,
      Instructions: data.tracking_status || null,
      ReasonCode: data.reason_code_description || null,
    },
    DTDC: {
      Status: data.trackHeader?.strStatus || "N/A",
      StrRemarks: data.trackHeader?.strRemarks || "N/A",
      StatusLocation: data.trackDetails?.length
        ? data.trackDetails[data.trackDetails.length - 1].strOrigin
        : "N/A",
      StatusDateTime: data.trackDetails?.length
        ? formatDTDCDateTime(
            data.trackDetails[data.trackDetails.length - 1].strActionDate,
            data.trackDetails[data.trackDetails.length - 1].strActionTime
          )
        : null,
      Instructions: data.trackDetails?.length
        ? data.trackDetails[data.trackDetails.length - 1].strAction
        : "N/A",
    },
    Amazon: {
      Status: data.summary?.status || "N/A",
      StatusLocation: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.location?.city
        : "N/A",
      StatusDateTime: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.eventTime
        : "N/A",
      Instructions: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.eventCode
        : "N/A",
      ShipmentType: data.eventHistory?.length
        ? data.eventHistory[data.eventHistory.length - 1]?.shipmentType
        : "N/A",
    },
    Shiprocket: {
      Status: data.current_status || null,
      StatusLocation: data.location || "Unknown",
      StatusDateTime: data.timestamp || null,
      Instructions: data.instructions || null,
    },
    NimbusPost: {
      Status: data.status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.city || "Unknown",
      StatusDateTime: data.updated_on || null,
      Instructions: data.remarks || null,
    },
    Delhivery: {
      Status: data.Status || "N/A",
      StatusType: data.StatusType || "N/A",
      StatusCode: data.StatusCode || null,
      StatusLocation: data.StatusLocation || "Unknown",
      StatusDateTime: data.StatusDateTime || null,
      Instructions: data.Instructions || null,
    },
    Xpressbees: {
      Status: data.tracking_status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.location || "Unknown",
      StatusDateTime: data.last_update || null,
      Instructions: data.remarks || null,
    },
    ShreeMaruti: {
      Status: data.status || null,
      StatusCode: data.status_code || null,
      StatusLocation: data.current_location || "Unknown",
      StatusDateTime: data.updated_at || null,
      Instructions: data.message || null,
    },
  };

  return providerMappings[provider] || null;
};

// setInterval(trackOrders, 60 * 100000);
const passbook = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await user.findOne({ _id: userId });
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ _id: users.Wallet });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.status(200).json({
      message: "Passbook fetched successfully",
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching passbook:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const users = await user.findOne({ _id: userId });
    if (!users) {
      return res.status(400).json({ message: "User Not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: "User not found" });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.user._id;

    // Validate orderId
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required." });
    }

    // Find and delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const GetTrackingByAwb = async (req, res) => {
  try {
    const { awb } = req.params;
    const order = await Order.findOne({ awb_number: awb });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // console.log("Order details:", order);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching tracking details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const formatDTDCDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null; // Return null if no valid date/time

  try {
    // Convert date from 'DDMMYYYY' to 'YYYY-MM-DD'
    const formattedDate = `${dateStr.slice(4, 8)}-${dateStr.slice(
      2,
      4
    )}-${dateStr.slice(0, 2)}`;

    // Convert time from 'HHMM' to 'HH:MM:SS'
    const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:00`;

    return new Date(`${formattedDate}T${formattedTime}Z`);
  } catch (error) {
    console.warn(`Invalid DTDC date/time format: ${dateStr} ${timeStr}`);
    return null; // Return null instead of an invalid string
  }
};

module.exports = {
  newOrder,
  getOrders,
  getOrdersByNdrStatus,
  updatedStatusOrders,
  getOrdersById,
  getpickupAddress,
  getreceiverAddress,
  newPickupAddress,
  newReciveAddress,
  ShipeNowOrder,
  getPinCodeDetails,
  cancelOrdersAtNotShipped,
  cancelOrdersAtBooked,
  // tracking,
  updateOrder,
  passbook,
  getUser,
  trackOrders,
  GetTrackingByAwb,
};
