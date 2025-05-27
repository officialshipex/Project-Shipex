const cron = require("node-cron");
const CodPlan = require("./codPan.model");
const codRemittance = require("./codRemittance.model");
const Order = require("../models/newOrder.model");
const adminCodRemittance = require("./adminCodRemittance.model");
const users = require("../models/User.model.js");
const Wallet = require("../models/wallet");
const afterPlan = require("./afterPlan.model");
const fs = require("fs");
const csvParser = require("csv-parser");
const ExcelJS = require("exceljs");
const path = require("path");
const xlsx = require("xlsx");
const File = require("../model/bulkOrderFiles.model.js");
const CourierCodRemittance = require("./CourierCodRemittance.js");
const CodRemittanceOrders = require("./CodRemittanceOrder.model.js");
const SameDateDelivered = require("./samedateDelivery.model.js");
// Core function: process remittances (no req/res here)
const processCourierCodRemittance=async()=> {
    // console.log("----------->")
  // Step 1: Get all Delivered COD Orders
  const codDeliveredOrders = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
        "paymentDetails.method": "COD",
      },
    },
  ]);

  // Step 2: Get all remitted orderIDs using aggregation
  const remittedOrders = await CourierCodRemittance.aggregate([
    {
      $project: {
        _id: 0,
        orderID: 1,
      },
    },
  ]);

  // Step 3: Extract orderIDs already remitted
  const remittedOrderIds = remittedOrders.map((entry) => entry.orderID);

  // Step 4: Filter unremitted COD Delivered orders
  const newCodDeliveredOrders = codDeliveredOrders.filter(
    (order) => !remittedOrderIds.includes(order.orderId)
  );

  // Step 5: Decide what orders to process
  const ordersToProcess =
    remittedOrderIds.length === 0 ? codDeliveredOrders : newCodDeliveredOrders;

  // Step 6: Save new remittance records
  for (const order of ordersToProcess) {
    const userData = await users.findOne({ _id: order.userId });
    if (!userData) {
      console.log(`User not found for order ${order.orderId}`);
      continue;
    }

    const lastTrackingUpdate =
      order.tracking?.length > 0
        ? order.tracking[order.tracking.length - 1]?.StatusDateTime
        : null;

    const newRemittance = new CourierCodRemittance({
      userId: order.userId,
      date: lastTrackingUpdate,
      orderID: order.orderId,
      userName: userData.fullname || "",
      PhoneNumber: userData.phoneNumber || "",
      Email: userData.email || "",
      courierProvider: order.courierServiceName || "",
      AwbNumber: order.awb_number || "",
      CODAmount: order.paymentDetails?.amount || 0,
      status: "Pending",
    });

    await newRemittance.save();
  }

  return {
    success: true,
    message: "Courier COD remittance processed successfully.",
  };
}
cron.schedule("* */12 * * *", () => {
  console.log("Running scheduled task at 1:45 AM: Fetching orders...");
  processCourierCodRemittance();
});
