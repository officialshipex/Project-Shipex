const ExcelJS = require("exceljs");
const xlsx = require("xlsx");
const fs = require("fs");
const Order = require("../models/newOrder.model");
const WeightDiscrepancy = require("./weightDispreancy.model");
const Wallet = require("../models/wallet");
const User = require("../models/User.model");
const cron = require("node-cron");
const { uploadToS3 } = require("../config/s3");
const { calculateRateForDispute } = require("../Rate/calculateRateController");
const Plan = require("../models/Plan.model");
const mongoose = require("mongoose");
const downloadExcel = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Weight Discrepancy");

    // Define headers
    worksheet.columns = [
      { header: "*AWB Number", key: "awb_number", width: 30 },
      { header: "*Charge Weight", key: "charge_weight", width: 20 },
      { header: "Length", key: "length", width: 15 },
      { header: "Breadth", key: "breadth", width: 15 },
      { header: "Height", key: "height", width: 15 },
    ];

    // Add a sample row
    worksheet.addRow({
      awb_number: "1212121212",
      charge_weight: "0.5",
      length: "10",
      breadth: "10",
      height: "10",
    });

    // Format header row (bold and centered)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Generate the Excel file in memory
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Weight_Discrepancy_Sample_Format.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(Buffer.from(buffer)); // ✅ Fix for corruption issue
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ error: "Error generating Excel file" });
  }
};

const uploadDispreancy = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const discrepancies = [];

    const awbNumbers = sheetData
      .map((row) => row["*AWB Number"]?.toString().trim())
      .filter(Boolean);

    const chargeWeightMap = {};
    for (const row of sheetData) {
      const awb = row["*AWB Number"]?.toString().trim();
      const chargeWeight = parseFloat(row["*Charge Weight"]);
      if (awb && !isNaN(chargeWeight)) {
        chargeWeightMap[awb] = {
          chargeWeight,
          length: parseFloat(row["Length"]) || null,
          breadth: parseFloat(row["Breadth"]) || null,
          height: parseFloat(row["Height"]) || null,
        };
      }
    }

    const existing = await WeightDiscrepancy.find({
      awbNumber: { $in: awbNumbers },
    }).select("awbNumber");
    const existingSet = new Set(existing.map((e) => e.awbNumber));

    const orders = await Order.find({ awb_number: { $in: awbNumbers } });
    const orderMap = new Map(orders.map((o) => [o.awb_number, o]));
    // console.log("order",orders)
    const planCache = new Map();

    for (const awb of awbNumbers) {
      const chargeData = chargeWeightMap[awb];
      if (!chargeData || existingSet.has(awb)) continue;

      const order = orderMap.get(awb);
      if (!order) {
        console.log(`Order not found for AWB: ${awb}`);
        continue;
      }

      const userId = order.userId.toString();
      let userPlan = planCache.get(userId);

      if (!userPlan) {
        userPlan = await Plan.findOne({ userId });
        if (!userPlan) continue;
        planCache.set(userId, userPlan);
      }

      const matchedRateCard = userPlan.rateCard.find(
        (r) => r.courierServiceName === order.courierServiceName
      );

      if (
        !matchedRateCard ||
        !matchedRateCard.weightPriceBasic?.length ||
        !matchedRateCard.weightPriceAdditional?.length
      )
        continue;
      // console.log("awb", awb);
      const basicWeightSlabGrams = matchedRateCard.weightPriceBasic[0].weight;
      const additionalWeightSlabGrams =
        matchedRateCard.weightPriceAdditional[0].weight;

      const deadWeightKg = order.packageDetails.deadWeight || 0;
      const volumetricWeightKg =
        ((order.packageDetails.volumetricWeight.length || 0) *
          (order.packageDetails.volumetricWeight.width || 0) *
          (order.packageDetails.volumetricWeight.height || 0)) /
        5000;

      const actualWeightKg = order.packageDetails.applicableWeight || 0;

      const applicableWeightKg = Math.max(volumetricWeightKg, actualWeightKg);

      // console.log("applicableWeightKg", applicableWeightKg);
      const roundedApplicableGrams =
        Math.ceil((applicableWeightKg * 1000) / basicWeightSlabGrams) *
        basicWeightSlabGrams;

      // console.log("roundedApplicableGrams", roundedApplicableGrams);
      const chargedGrams =
        Math.ceil(
          (chargeData.chargeWeight * 1000) / additionalWeightSlabGrams
        ) * additionalWeightSlabGrams;
      const chargedKg = chargedGrams / 1000;
      if (chargedGrams <= basicWeightSlabGrams) continue;
      // console.log("chargedGrams", chargedGrams);
      // console.log("chargedKg", chargedKg);
      if (chargedGrams <= roundedApplicableGrams) continue;

      let excessGrams = chargedGrams - roundedApplicableGrams;

      excessGrams =
        Math.ceil(excessGrams / additionalWeightSlabGrams) *
        additionalWeightSlabGrams;
      console.log("excessGrams", excessGrams);
      const excessWeight = parseFloat((excessGrams / 1000).toFixed(2));
      console.log("excessWeight", excessWeight);
      if (excessWeight <= 0) continue;
      console.log("awb", awb);
      const payload = {
        pickupPincode: order.pickupAddress.pinCode,
        deliveryPincode: order.receiverAddress.pinCode,
        length: order.packageDetails.volumetricWeight.length,
        breadth: order.packageDetails.volumetricWeight.width,
        height: order.packageDetails.volumetricWeight.height,
        weight: excessWeight,
        cod: order.paymentDetails.method === "COD" ? "Yes" : "No",
        valueInINR: order.paymentDetails.amount,
        userID: order.userId,
        filteredServices: order.courierServiceName,
      };

      const additionalCharges = await calculateRateForDispute(payload);
      if (!additionalCharges || !additionalCharges[0]) continue;

      // console.log("additionalCharges", additionalCharges);

      const discrepancy = new WeightDiscrepancy({
        userId,
        awbNumber: order.awb_number,
        orderId: order.orderId,
        productDetails: order.productDetails,
        courierServiceName: order.courierServiceName || order.provider,
        provider: order.provider,
        enteredWeight: {
          applicableWeight: roundedApplicableGrams / 1000,
          deadWeight: deadWeightKg,
          volumetricWeight: {
            length: order.packageDetails.volumetricWeight.length,
            breadth: order.packageDetails.volumetricWeight.width,
            height: order.packageDetails.volumetricWeight.height,
          },
        },
        chargedWeight: {
          applicableWeight: chargedKg,
          deadWeight: chargeData.chargeWeight,
        },
        chargeDimension: {
          length: chargeData.length,
          breadth: chargeData.breadth,
          height: chargeData.height,
        },
        excessWeightCharges: {
          excessWeight,
          excessCharges:
            additionalCharges[0].forward.charges +
            additionalCharges[0].forward.gst,
          pendingAmount:
            additionalCharges[0].forward.charges +
            additionalCharges[0].forward.gst,
        },
        status: "new",
        adminStatus: "pending",
      });

      discrepancies.push(discrepancy);
      // console.log("final data", discrepancy);
    }

    if (discrepancies.length > 0) {
      // Step 1: Accumulate pending amounts per walletId
      const walletUpdates = new Map();

      for (const discrepancy of discrepancies) {
        const userId = discrepancy.userId;

        const userDetails = await User.findById(userId).select("Wallet");
        if (!userDetails || !userDetails.Wallet) continue;

        const walletId = userDetails.Wallet.toString();
        const amountToHold = Number(
          discrepancy.excessWeightCharges?.pendingAmount || 0
        ).toFixed(2);

        // console.log("amoutn", amountToHold);

        if (isNaN(amountToHold)) {
          console.warn(
            `Invalid pendingAmount for AWB ${discrepancy.awbNumber}:`,
            discrepancy.excessWeightCharges.pendingAmount
          );
          continue;
        }

        const currentAmount = walletUpdates.get(walletId) || 0;
        walletUpdates.set(walletId, currentAmount + Number(amountToHold));
      }

      // Step 2: Apply holdAmount updates
      for (const [walletId, amount] of walletUpdates.entries()) {
        await Wallet.updateOne(
          { _id: walletId },
          {
            $inc: { holdAmount: amount },
          }
        );

        console.log(walletId, amount);
      }

      // Step 3: Save discrepancies
      await WeightDiscrepancy.insertMany(discrepancies);
      console.log(`${discrepancies.length} discrepancies saved.`);
    }

    fs.promises.unlink(filePath).catch((err) => {
      console.error("Error deleting uploaded file:", err);
    });

    res.status(200).json({
      success: true,
      message: "Weight discrepancies recorded successfully",
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AllDiscrepancy = async (req, res) => {
  try {
    const statusCounts = await WeightDiscrepancy.aggregate([
      {
        $group: {
          _id: "$adminStatus", // group by status field
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Optional: also return full data if needed
    const allDiscrepancies = await WeightDiscrepancy.find({}, null, {
      lean: true,
    });

    res.status(200).json({
      success: true,
      data: {
        statusCounts, // e.g., [{ status: "Resolved", count: 4 }, ...]
        discrepancies: allDiscrepancies,
      },
    });
  } catch (error) {
    console.error("Error fetching discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllDiscrepancy = async (req, res) => {
  try {
    const {
      userSearch,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
      awbNumber,
      orderId,
      status,
      provider,
    } = req.query;
    console.log("re", req.query);
    const userMatchStage = {};
    const discrepancyMatchStage = {};

    // User search filter
    if (userSearch) {
      const regex = new RegExp(userSearch, "i");
      if (mongoose.Types.ObjectId.isValid(userSearch)) {
        userMatchStage["$or"] = [
          { "user._id": new mongoose.Types.ObjectId(userSearch) },
          { "user.email": regex },
          { "user.fullname": regex },
        ];
      } else {
        userMatchStage["$or"] = [
          { "user.email": regex },
          { "user.fullname": regex },
        ];
      }
    }

    // Date range filter
    if (fromDate && toDate) {
      const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      discrepancyMatchStage["createdAt"] = { $gte: startDate, $lte: endDate };
    }

    if (status) {
      discrepancyMatchStage["adminStatus"] = status;
    }

    if (provider) {
      discrepancyMatchStage["provider"] = provider;
    }

    if (awbNumber) {
      discrepancyMatchStage["awbNumber"] = awbNumber;
    }

    if (orderId) {
      discrepancyMatchStage["orderId"] = Number(orderId);
    }

    const parsedLimit = limit === "all" ? 0 : Number(limit);
    const skip = (Number(page) - 1) * parsedLimit;

    const basePipeline = [
      { $match: discrepancyMatchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: userMatchStage },
      {
        $project: {
          _id: 1,
          userId: "$userId",
          awbNumber: 1,
          orderId: 1,
          courierServiceName: 1,
          provider: 1,
          productDetails: 1,
          enteredWeight: 1,
          chargedWeight: 1,
          chargeDimension: 1,
          excessWeightCharges: 1,
          status: 1,
          adminStatus: 1,
          clientStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          text: 1,
          imageUrl: 1,
          user: {
            userId: "$user.userId",
            name: "$user.fullname",
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const [results, totalResult] = await Promise.all([
      parsedLimit === 0
        ? WeightDiscrepancy.aggregate(basePipeline)
        : WeightDiscrepancy.aggregate([
            ...basePipeline,
            { $skip: skip },
            { $limit: parsedLimit },
          ]),

      WeightDiscrepancy.aggregate([...basePipeline, { $count: "total" }]),
    ]);

    const total = totalResult[0]?.total || 0;

    return res.json({
      total,
      page: Number(page),
      limit: parsedLimit === 0 ? "all" : parsedLimit,
      results,
    });
  } catch (error) {
    console.error("Error fetching discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AllDiscrepancyCountBasedId = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate status counts for this user
    const statusCounts = await WeightDiscrepancy.aggregate([
      {
        $match: { userId }, // filter by logged-in user
      },
      {
        $group: {
          _id: "$status", // group by status
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get full discrepancy data for this user
    const discrepancies = await WeightDiscrepancy.find({ userId }, null, {
      lean: true,
    });

    if (!discrepancies.length) {
      return res.status(404).json({
        success: false,
        message: "No discrepancies found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        statusCounts,
        discrepancies,
      },
    });
  } catch (error) {
    console.error("Error fetching user discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AllDiscrepancyBasedId = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      page = 1,
      limit = 20,
      awbNumber,
      orderId,
      status,
      provider,
    } = req.query;

    const userId = req.user._id;
    const discrepancyMatchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    // Date range filter
    if (fromDate && toDate) {
      const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      discrepancyMatchStage["createdAt"] = { $gte: startDate, $lte: endDate };
    }

    if (status) {
      discrepancyMatchStage["status"] = status;
    }

    if (provider) {
      discrepancyMatchStage["provider"] = provider;
    }

    if (awbNumber) {
      discrepancyMatchStage["awbNumber"] = awbNumber;
    }

    if (orderId) {
      discrepancyMatchStage["orderId"] = Number(orderId);
    }

    const parsedLimit = limit.toLowerCase() === "all" ? null : Number(limit);
    const skip = parsedLimit ? (Number(page) - 1) * parsedLimit : 0;

    const basePipeline = [
      { $match: discrepancyMatchStage },
      {
        $project: {
          _id: 1,
          userId: "$userId",
          awbNumber: 1,
          orderId: 1,
          courierServiceName: 1,
          provider: 1,
          productDetails: 1,
          enteredWeight: 1,
          chargedWeight: 1,
          chargeDimension: 1,
          excessWeightCharges: 1,
          status: 1,
          adminStatus: 1,
          clientStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          text: 1,
          imageUrl: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const [results, totalResult] = await Promise.all([
      parsedLimit === null
        ? WeightDiscrepancy.aggregate(basePipeline)
        : WeightDiscrepancy.aggregate([
            ...basePipeline,
            { $skip: skip },
            { $limit: parsedLimit },
          ]),
      WeightDiscrepancy.aggregate([...basePipeline, { $count: "total" }]),
    ]);

    const total = totalResult[0]?.total || 0;
    const totalPages = parsedLimit ? Math.ceil(total / parsedLimit) : 1;

    return res.json({
      total,
      page: Number(page),
      limit: parsedLimit ?? "all",
      page: totalPages,
      currentPage: Number(page),
      results,
    });
  } catch (error) {
    console.error("Error fetching user discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AcceptDiscrepancy = async (req, res) => {
  try {
    const userId = req.user._id;
    const { awb_number } = req.body;

    // Fetch the discrepancy details
    const discrepancies = await WeightDiscrepancy.findOne({
      awbNumber: awb_number,
    });
    if (!discrepancies) {
      return res
        .status(404)
        .json({ success: false, message: "Discrepancy not found" });
    }

    // Ensure discrepancy is in 'new' status
    if (discrepancies.status !== "new") {
      return res.status(400).json({
        success: false,
        message: "Discrepancy is already processed or not in 'new' status",
      });
    }

    const extraCharges = parseFloat(
      discrepancies.excessWeightCharges.excessCharges
    );
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wallet = await Wallet.findById(user.Wallet);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    console.log("Wallet Balance (Before):", wallet.balance);
    console.log("Wallet Hold Amount (Before):", wallet.holdAmount);

    // Deduct extraCharges from wallet balance and holdAmount
    wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));
    wallet.holdAmount = Math.max(
      0,
      parseFloat((wallet.holdAmount - extraCharges).toFixed(2))
    );

    // Add transaction entry
    const newTransaction = {
      channelOrderId: discrepancies.orderId,
      category: "debit",
      amount: extraCharges,
      balanceAfterTransaction: wallet.balance,
      awb_number: awb_number,
      description: `Weight Dispute Charges Applied`,
    };
    wallet.transactions.push(newTransaction);

    // Save wallet and discrepancy changes
    await wallet.save();

    discrepancies.status = "Accepted";
    discrepancies.clientStatus = "Accepted by Client";
    discrepancies.adminStatus = "Accepted";
    discrepancies.excessWeightCharges.pendingAmount = 0;
    await discrepancies.save();

    return res.status(200).json({
      success: true,
      message: "Discrepancy accepted",
      updatedWalletBalance: wallet.balance,
      updatedHoldAmount: wallet.holdAmount,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error in AcceptDiscrepancy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const AcceptAllDiscrepancies = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { orderIds } = req.body;

    if (!orderIds || orderIds.length === 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "No order IDs provided" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wallet = await Wallet.findById(user.Wallet).session(session);
    if (!wallet) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    let discrepanciesToUpdate = [];

    for (const orderId of orderIds) {
      const discrepancy = await WeightDiscrepancy.findById(orderId).session(
        session
      );

      if (!discrepancy) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Discrepancy not found for ID: ${orderId}`,
        });
      }

      if (discrepancy.status !== "new") {
        continue; // skip already processed
      }

      const extraCharges = parseFloat(
        discrepancy.excessWeightCharges.excessCharges
      );

      discrepanciesToUpdate.push({ discrepancy, extraCharges });
    }

    if (discrepanciesToUpdate.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "No new discrepancies found to accept",
      });
    }

    // Sequentially deduct per discrepancy
    for (const { discrepancy, extraCharges } of discrepanciesToUpdate) {
      wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));
      wallet.holdAmount = Math.max(
        0,
        parseFloat((wallet.holdAmount - extraCharges).toFixed(2))
      );

      const newTransaction = {
        channelOrderId: discrepancy.orderId,
        category: "debit",
        amount: extraCharges,
        balanceAfterTransaction: wallet.balance, // ✅ updated per order
        awb_number: discrepancy.awbNumber,
        description: "Weight Dispute Charges Applied",
        createdAt: new Date(),
      };

      wallet.transactions.push(newTransaction);

      // update discrepancy
      discrepancy.status = "Accepted";
      discrepancy.clientStatus = "Accepted by Client";
      discrepancy.adminStatus = "Accepted";
      discrepancy.excessWeightCharges.pendingAmount = 0;

      await discrepancy.save({ session });
    }

    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "All valid discrepancies accepted",
      updatedWalletBalance: wallet.balance,
      updatedHoldAmount: wallet.holdAmount,
      totalAccepted: discrepanciesToUpdate.length,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in AcceptAllDiscrepancies:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const autoAcceptDiscrepancies = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Running auto-accept discrepancy job...");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const discrepancies = await WeightDiscrepancy.find({
      status: "new",
      createdAt: { $lte: sevenDaysAgo },
    }).session(session);

    for (const discrepancy of discrepancies) {
      const user = await User.findById(discrepancy.userId).session(session);
      if (!user) {
        console.log(`User not found for discrepancy ${discrepancy.awbNumber}`);
        continue;
      }

      const wallet = await Wallet.findById(user.Wallet).session(session);
      if (!wallet) {
        console.log(`Wallet not found for user ${user._id}`);
        continue;
      }

      const extraCharges = parseFloat(
        discrepancy.excessWeightCharges?.excessCharges || 0
      );
      if (extraCharges <= 0) {
        console.log(
          `No extra charges found for discrepancy ${discrepancy.awbNumber}`
        );
        continue;
      }

      // Deduct from balance and holdAmount safely
      wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));
      wallet.holdAmount = Math.max(
        0,
        parseFloat((wallet.holdAmount - extraCharges).toFixed(2))
      );

      const newTransaction = {
        channelOrderId: discrepancy.orderId,
        category: "debit",
        amount: extraCharges,
        balanceAfterTransaction: wallet.balance,
        awb_number: discrepancy.awbNumber,
        description: `Auto-accepted Weight Dispute charge`,
        createdAt: new Date(),
      };

      wallet.transactions.push(newTransaction);
      await wallet.save({ session });

      discrepancy.status = "Accepted";
      discrepancy.clientStatus = "Auto Accepted";
      discrepancy.adminStatus = "Accepted";
      discrepancy.excessWeightCharges.pendingAmount = 0;
      await discrepancy.save({ session });

      console.log(
        `Discrepancy ${discrepancy.awbNumber} auto-accepted. Updated Wallet Balance: ${wallet.balance}, HoldAmount: ${wallet.holdAmount}`
      );
    }

    await session.commitTransaction();
    session.endSession();

    console.log("Auto-accept discrepancy job completed.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in autoAcceptDiscrepancies:", error);
  }
};

// Schedule job to run every day at midnight
cron.schedule("0 0 * * *", autoAcceptDiscrepancies);

// Raise Discrepancies
const raiseDiscrepancies = async (req, res) => {
  try {
    const { awbNumber, text } = req.body;
    // console.log(awbNumber, text);

    // Validate Input
    if (!awbNumber || !text) {
      return res
        .status(400)
        .json({ message: "AWB Number and text are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Get Image URL from multer-s3
    const imageUrl = req.file.location;
    // console.log("Image URL:", imageUrl);

    // Find and update existing discrepancy
    const updatedPost = await WeightDiscrepancy.findOneAndUpdate(
      { awbNumber }, // Find by AWB Number
      {
        text,
        imageUrl,
        status: "Discrepancy Raised",
        adminStatus: "Discrepancy Raised",
        clientStatus: "Discrepancy Raised",
        discrepancyRaisedAt: new Date(),
      },
      { new: true, upsert: false } // Return updated document, do not create a new one if not found
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "No existing discrepancy found for this AWB Number" });
    }

    res.status(200).json({
      message: "Discrepancy updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating discrepancy:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const adminAcceptDiscrepancy = async (req, res) => {
  try {
    const { awbNumber } = req.body;
    console.log("Accepting discrepancy for AWB:", awbNumber);

    // Find discrepancy by AWB number
    const discrepancy = await WeightDiscrepancy.findOne({ awbNumber });
    if (!discrepancy) {
      return res.status(404).json({ message: "Discrepancy not found" });
    }

    // Only proceed if adminStatus is "Discrepancy Raised"
    if (discrepancy.adminStatus !== "Discrepancy Raised") {
      return res
        .status(400)
        .json({ message: "Discrepancy is not raised by admin" });
    }

    // Fetch user and wallet
    const user = await User.findById(discrepancy.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for this discrepancy" });
    }

    const wallet = await Wallet.findById(user.Wallet);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found for user" });
    }

    // Deduct from holdAmount
    const extraCharges = parseFloat(
      discrepancy.excessWeightCharges?.excessCharges || 0
    );
    wallet.holdAmount = Math.max(
      0,
      parseFloat((wallet.holdAmount - extraCharges).toFixed(2))
    );
    await wallet.save();

    // Update discrepancy
    discrepancy.excessWeightCharges.pendingAmount = 0;
    discrepancy.status = "Accepted";
    discrepancy.adminStatus = "Discrepancy Accepted";
    discrepancy.clientStatus = "Discrepancy Accepted";
    discrepancy.discrepancyAcceptedAt = new Date();
    await discrepancy.save();

    res.status(200).json({ message: "Discrepancy accepted successfully" });
  } catch (error) {
    console.error("Error accepting discrepancy:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const declineDiscrepancy = async (req, res) => {
  try {
    const { awbNumber, text } = req.body;

    console.log(`Processing discrepancy decline for AWB: ${awbNumber}`);

    // Validate input
    if (!awbNumber || !text) {
      // console.log("hii")
      return res
        .status(400)
        .json({ message: "AWB Number and reason are required" });
    }

    // Find the discrepancy
    const discrepancy = await WeightDiscrepancy.findOne({ awbNumber });
    if (!discrepancy) {
      return res.status(404).json({ message: "Discrepancy not found" });
    }

    // Update discrepancy status
    Object.assign(discrepancy, {
      status: "new",
      adminStatus: "Discrepancy Declined",
      clientStatus: "Discrepancy Declined",
      discrepancyDeclinedReason: text,
      discrepancyDeclinedAt: new Date(),
    });

    await discrepancy.save();

    return res
      .status(200)
      .json({ message: "Discrepancy declined successfully" });
  } catch (error) {
    console.error("Error declining discrepancy:", error);
    return res.status(500).json({
      message: "An error occurred while declining the discrepancy",
      error: error.message,
    });
  }
};

const exportWeightDiscrepancy = async (req, res) => {
  try {
    const { disputeId } = req.body;
    if (!disputeId || !Array.isArray(disputeId) || disputeId.length === 0) {
      return res.status(400).json({ message: "disputeId array is required" });
    }

    const objectIds = disputeId
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // Aggregate pipeline
    const pipeline = [
      { $match: { _id: { $in: objectIds } } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          userId: "$user.userId", // Use 5-digit userId from users collection
          awbNumber: 1,
          orderId: 1,
          courierServiceName: 1,
          provider: 1,

          // Keep full productDetails array for processing in JS
          productDetails: 1,

          enteredWeightApplicable: "$enteredWeight.applicableWeight",
          chargedWeightApplicable: "$chargedWeight.applicableWeight",

          excessWeight: "$excessWeightCharges.excessWeight",
          excessCharges: "$excessWeightCharges.excessCharges",

          status: 1,
          adminStatus: 1,
          clientStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          text: 1,
          imageUrl: 1,

          user: {
            name: "$user.fullname",
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const results = await WeightDiscrepancy.aggregate(pipeline);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No discrepancy data found for given IDs" });
    }

    // Process results for CSV export
    const csvData = results.map((item) => ({
      // DiscrepancyID: item._id.toString(),
      UserID: item.userId || "",
      UserName: item.user.name || "",
      UserEmail: item.user.email || "",
      PhoneNumber: item.user.phoneNumber || "",
      AWBNumber: item.awbNumber || "",
      OrderID: item.orderId || "",
      CourierServiceName: item.courierServiceName || "",
      Provider: item.provider || "",

      // Join product names by comma
      ProductNames: Array.isArray(item.productDetails)
        ? item.productDetails
            .map((pd) => pd.name)
            .filter(Boolean)
            .join(", ")
        : "",

      EnteredWeightApplicable: item.enteredWeightApplicable || "",
      ChargedWeightApplicable: item.chargedWeightApplicable || "",
      ExcessWeight: item.excessWeight || "",
      ExcessCharges: item.excessCharges || "",

      Status: item.status || "",
      // AdminStatus: item.adminStatus || "",
      // ClientStatus: item.clientStatus || "",
      // CreatedAt: item.createdAt ? item.createdAt.toISOString() : "",
      // UpdatedAt: item.updatedAt ? item.updatedAt.toISOString() : "",
      // Text: item.text || "",
      // ImageUrl: item.imageUrl || "",
    }));

    const csvHeaders = Object.keys(csvData[0]);
    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        csvHeaders
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weight_discrepancy_export.csv"
    );
    return res.send(csvContent);
  } catch (error) {
    console.error("Error exporting weight discrepancy data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  downloadExcel,
  uploadDispreancy,
  AllDiscrepancy,
  getAllDiscrepancy,
  AllDiscrepancyBasedId,
  AllDiscrepancyCountBasedId,
  AcceptDiscrepancy,
  AcceptAllDiscrepancies,
  raiseDiscrepancies,
  adminAcceptDiscrepancy,
  declineDiscrepancy,
  exportWeightDiscrepancy,
};
