const Order = require("../models/newOrder.model"); // Adjust the path to your model
const user = require("../models/User.model");
const pickAddress = require("../models/pickupAddress.model");
const receiveAddress = require("../models/deliveryAddress.model");
const Courier = require("../models/AllCourierSchema");
const CourierService = require("../models/CourierService.Schema");
const Plan = require("../models/Plan.model");
const Wallet=require("../models/wallet")
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
const mongoose = require("mongoose");
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



const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pickupAddress, receiverAddress, paymentDetails, packageDetails } = req.body;

    console.log(req.body)
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
  console.log(pickupAddress)
  
    const updateFields = {};

    // Update pickupAddress if provided
    if (pickupAddress) {
      updateFields.pickupAddress = {
        contactName: pickupAddress.contactName || existingOrder.pickupAddress.contactName,
        phoneNumber: pickupAddress.phoneNumber || existingOrder.pickupAddress.phoneNumber,
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
        contactName: receiverAddress.contactName || existingOrder.receiverAddress.contactName,
        phoneNumber: receiverAddress.phoneNumber || existingOrder.receiverAddress.phoneNumber,
        email: receiverAddress.email || existingOrder.receiverAddress.email,
        address: receiverAddress.address || existingOrder.receiverAddress.address,
        city: receiverAddress.city || existingOrder.receiverAddress.city,
        state: receiverAddress.state || existingOrder.receiverAddress.state,
        pinCode: receiverAddress.pinCode || existingOrder.receiverAddress.pinCode,
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
        deadWeight: packageDetails.deadWeight || existingOrder.packageDetails.deadWeight,
        applicableWeight: packageDetails.applicableWeight || existingOrder.packageDetails.applicableWeight,
        volumetricWeight: {
          length: packageDetails.volumetricWeight?.length || existingOrder.packageDetails.volumetricWeight.length,
          width: packageDetails.volumetricWeight?.width || existingOrder.packageDetails.volumetricWeight.width,
          height: packageDetails.volumetricWeight?.height || existingOrder.packageDetails.volumetricWeight.height,
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
  console.log("Received ID:", id);

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
      { $set: { status: "new" } },
      { new: true }
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
    const receiverAddresses = await receiveAddress.find({ userId: req.user._id });

    if (!receiverAddresses.length) {
      return res.status(404).json({ success: false, message: "No receiver addresses found" });
    }

    res.status(200).json({ success: true, data: receiverAddresses });
  } catch (error) {
    console.error("Error fetching receiver addresses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    const users=await user.findOne({_id:order.userId })
    const userWallet=await Wallet.findOne({_id:users.Wallet})
    // console.log("ahsaisa",userWallet)
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
    const currentOrder = await Order.findById({ _id: orderData._id });

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
  try {
    const users=await user.findOne({_id:allOrders.userId})
    const currentWallet = await Wallet.findById({_id:users.Wallet});

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
    let balanceTobeAdded = allOrders.totalFreightCharges === "N/A" ? 0 : parseInt(allOrders.totalFreightCharges);
    await currentWallet.updateOne({
      $inc: { balance: balanceTobeAdded },
      $push: {
        transactions: {
          channelOrderId: currentOrder.orderId|| null, // Include if available
          category: "credit",
          amount: balanceTobeAdded, // Fixing incorrect reference
          balanceAfterTransaction: currentWallet.balance + balanceTobeAdded,
          date: new Date().toISOString().slice(0, 16).replace("T", " "), // Format date & time
          awb_number: allOrders.awb_number || "", // Ensuring it follows the schema
          description: `Order #${currentOrder.orderId} Shipment cancelled by ${allOrders.receiverAddress.contactName}`,
        }
        
      },
    });
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
      success: true,
    });
  } catch (error) {
    console.error("Error cancelling orders:", error);
    res
      .status(500)
      .send({ error: "An error occurred while cancelling orders." });
  }
};
const tracking = async (req, res) => {
  
  try {
    const allOrders = await Promise.all(
      req.body.map((order) => Order.findById(order._id))
    );

    
    const updateOrderStatus = async (order, status,data) => {   
      if(data=="booked"){
        order.status = status;
      }
      if (data == "cancelled") {
        order.status = status;
      }
      if (data == "in transit") {
        order.status = status;
      }
      if (data == "delivered") {
        order.status = status;
      }
      await order.save();
    };

    const trackingPromises = allOrders.map(async (order) => {
      try {
        const { provider } = order;
        const { awb_number } = order;
        let result;

        if (provider === "NimbusPost") {
          result = await trackShipmentNimbuspost(awb_number);
        } else if (provider === "Shiprocket") {
          result = await getTrackingByAWB(awb_number);
        } else if (provider === "Xpressbees") {
          result = await trackShipment(awb_number);
          // console.log("sadasdas43",result)
          console.log("Tracking result", result);
        } else if (provider === "Delhivery") {
          result = await trackShipmentDelhivery(awb_number);
        } else if (provider === "ShreeMaruti") {
          result = await trackOrderShreeMaruti(awb_number);
        }

        if (result && result.success) {
          const status = result.data.toLowerCase().replace(/_/g, " ");

          const statusMap = {
            "booked": () => updateOrderStatus(order, "Ready To Ship","booked"),
            "cancelled": () => updateOrderStatus(order, "Cancelled","cancelled"),
            "in transit": () => updateOrderStatus(order, "In-transit","in transit"),
            
             "delivered":()=>updateOrderStatus(order,"Delivered","delivered")
            
          };

          if (statusMap[status]) {
            await statusMap[status]();
          }
        }
      } catch (error) {
        console.error(
          `Error processing order ID: ${order._id}, AWB: ${order.awb_number}`,
          error
        );
      }
    });

    await Promise.all(trackingPromises);

    res.status(200).json({ message: "Tracking updated successfully" });
  } catch (error) {
    console.error("Error in tracking:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const passbook=async(req,res)=>{
  try {
    const  userId  = req.user._id;
  // console.log("sdadasdas",userId)
  const users=await user.findOne({_id:userId})
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ _id:users.Wallet });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.status(200).json({
      message: "Passbook fetched successfully",
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Error fetching passbook:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
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
  tracking,
  updateOrder,
  passbook
};
