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
      const awbNumber = row["*AWB Number"]?.toString().trim();
      const chargeWeight = parseFloat(row["*Charge Weight"]);
      if (awbNumber && !isNaN(chargeWeight)) {
        chargeWeightMap[awbNumber] = {
          chargeWeight,
          length: row["Length"] ? parseFloat(row["Length"]) : null,
          breadth: row["Breadth"] ? parseFloat(row["Breadth"]) : null,
          height: row["Height"] ? parseFloat(row["Height"]) : null,
        };
      }
    }

    const existingDiscrepancies = await WeightDiscrepancy.find({
      awbNumber: { $in: awbNumbers },
    }).select("awbNumber");
    const existingAwbSet = new Set(
      existingDiscrepancies.map((d) => d.awbNumber)
    );

    const orders = await Order.find({ awb_number: { $in: awbNumbers } });
    const orderMap = new Map(orders.map((order) => [order.awb_number, order]));

    const planCache = new Map();

    for (const awbNumber of awbNumbers) {
      const chargeData = chargeWeightMap[awbNumber];
      if (!chargeData || existingAwbSet.has(awbNumber)) {
        continue;
      }

      const order = orderMap.get(awbNumber);
      if (!order) {
        console.log(`Order not found for AWB: ${awbNumber}`);
        continue;
      }

      const userId = order.userId.toString();
      let userPlan = planCache.get(userId);
      if (!userPlan) {
        userPlan = await Plan.findOne({ userId });
        if (!userPlan || !Array.isArray(userPlan.rateCard)) {
          console.log(`Plan not found for userId: ${userId}`);
          continue;
        }
        planCache.set(userId, userPlan);
      }

      const matchedRateCard = userPlan.rateCard.find(
        (rate) => rate.courierServiceName === order.courierServiceName
      );
      if (
        !matchedRateCard ||
        !Array.isArray(matchedRateCard.weightPriceBasic)
      ) {
        console.log(`Rate card not matched for AWB: ${awbNumber}`);
        continue;
      }

      const weightTier = matchedRateCard.weightPriceBasic[0];
      const weightTierKg = weightTier.weight / 1000;
      if (
        !weightTier ||
        typeof weightTierKg !== "number" ||
        chargeData.chargeWeight <= weightTierKg
      ) {
        continue;
      }

      const excessWeight = parseFloat(
        (
          chargeData.chargeWeight - order.packageDetails.applicableWeight
        ).toFixed(2)
      );

      // Skip if excessWeight is 0 or less
      if (excessWeight <= 0) {
        console.log(
          `Skipping AWB ${awbNumber} - Excess weight is ${excessWeight}`
        );
        continue;
      }

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
      if (!additionalCharges || !additionalCharges[0]) {
        console.log(`Rate calculation failed for AWB: ${awbNumber}`);
        continue;
      }

      const discrepancyEntry = new WeightDiscrepancy({
        userId,
        awbNumber: order.awb_number,
        orderId: order.orderId,
        productDetails: order.productDetails,
        courierServiceName: order?.courierServiceName || order?.provider,
        provider: order.provider,
        enteredWeight: {
          applicableWeight: order.packageDetails.applicableWeight,
          deadWeight: order.packageDetails.deadWeight,
        },
        chargedWeight: {
          applicableWeight: chargeData.chargeWeight,
          deadWeight: chargeData.chargeWeight,
        },
        chargeDimension: {
          length: chargeData.length,
          breadth: chargeData.breadth,
          height: chargeData.height,
        },
        excessWeightCharges: {
          excessWeight,
          excessCharges: additionalCharges[0].forward.finalCharges,
          pendingAmount: additionalCharges[0].forward.finalCharges,
        },
        status: "new",
        adminStatus: "pending",
      });

      discrepancies.push(discrepancyEntry);
    }

    // Bulk save all discrepancy entries
    if (discrepancies.length > 0) {
      await WeightDiscrepancy.insertMany(discrepancies);
      console.log(`${discrepancies.length} discrepancies saved.`);
    }

    // Async delete the uploaded file
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
    const allDiscrepancies = await WeightDiscrepancy.find();

    if (!allDiscrepancies.length) {
      return res
        .status(404)
        .json({ success: false, message: "No discrepancies found" });
    }

    res.status(200).json({ success: true, data: allDiscrepancies });
  } catch (error) {
    console.error("Error fetching discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AllDiscrepancyBasedId = async (req, res) => {
  try {
    const id = req.user._id;
    // console.log(id)
    const allDiscrepancies = await WeightDiscrepancy.find({ userId: id });
    // console.log(allDiscrepancies)

    if (!allDiscrepancies.length) {
      return res
        .status(404)
        .json({ success: false, message: "No discrepancies found" });
    }

    res.status(200).json({ success: true, data: allDiscrepancies });
  } catch (error) {
    console.error("Error fetching discrepancies:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const AcceptDiscrepancy = async (req, res) => {
  try {
    console.log("User ID:", req.user._id);
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

    // Convert extraCharges to a number
    const extraCharges = parseFloat(
      discrepancies.excessWeightCharges.excessCharges
    );
    console.log("Extra Charges:", extraCharges);

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch user's wallet
    const wallet = await Wallet.findById(user.Wallet);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    console.log("Wallet Balance (Before Deduction):", wallet.balance);

    // Deduct extra charges from wallet balance (without checking balance)
    wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));

    // Create a new transaction entry
    const newTransaction = {
      channelOrderId: discrepancies.orderId,
      category: "debit",
      amount: extraCharges,
      balanceAfterTransaction: wallet.balance,
      awb_number: awb_number,
      description: `Charge for excess weight`,
    };

    // Push transaction to wallet transactions array
    wallet.transactions.push(newTransaction);

    // Save wallet changes
    await wallet.save();

    // Update discrepancy status
    discrepancies.status = "Accepted";
    discrepancies.clientStatus = "Accepted by Client";
    discrepancies.adminStatus = "Accepted";
    discrepancies.excessWeightCharges.pendingAmount = 0;
    await discrepancies.save();

    return res.status(200).json({
      success: true,
      message: "Discrepancy accepted",
      updatedWalletBalance: wallet.balance,
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
  try {
    console.log("User ID:", req.user._id);
    const userId = req.user._id;
    console.log(req.body);

    const { orderIds } = req.body; // Expecting an array of order IDs

    if (!orderIds || orderIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order IDs provided" });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch user's wallet
    const wallet = await Wallet.findById(user.Wallet);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    console.log("Wallet Balance (Before Deduction):", wallet.balance);

    let totalExtraCharges = 0;
    let discrepanciesToUpdate = [];

    // Loop through each Order ID to validate and calculate total charges
    for (const orderId of orderIds) {
      const discrepancy = await WeightDiscrepancy.findOne({ _id: orderId });

      if (!discrepancy) {
        return res.status(404).json({
          success: false,
          message: `Discrepancy not found for Order ID: ${orderId}`,
        });
      }

      // Convert extraCharges to a number
      const extraCharges = parseFloat(
        discrepancy.excessWeightCharges.excessCharges
      );
      totalExtraCharges += extraCharges;

      // Store discrepancies for later updates
      discrepanciesToUpdate.push({ discrepancy, extraCharges });
    }

    console.log("Total Extra Charges:", totalExtraCharges);

    // Deduct total extra charges from wallet balance (without checking sufficiency)
    wallet.balance = parseFloat(
      (wallet.balance - totalExtraCharges).toFixed(2)
    );

    // Create and save individual transactions for each discrepancy
    for (const { discrepancy, extraCharges } of discrepanciesToUpdate) {
      const newTransaction = {
        channelOrderId: discrepancy.orderId,
        category: "debit",
        amount: extraCharges,
        balanceAfterTransaction: wallet.balance,
        awb_number: discrepancy.awbNumber,
        description: `Charge for excess weight`,
      };

      // Push the transaction to wallet's transactions array
      wallet.transactions.push(newTransaction);

      // Update discrepancy status
      discrepancy.status = "Accepted";
      discrepancy.clientStatus = "Accepted by Client";
      discrepancy.adminStatus = "Accepted";
      discrepancy.excessWeightCharges.pendingAmount = 0;
      await discrepancy.save();
    }

    // Save wallet changes after all deductions
    await wallet.save();

    return res.status(200).json({
      success: true,
      message: "All discrepancies accepted",
      updatedWalletBalance: wallet.balance,
    });
  } catch (error) {
    console.error("Error in AcceptAllDiscrepancies:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const autoAcceptDiscrepancies = async () => {
  try {
    console.log("Running auto-accept discrepancy job...");

    // Get the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find discrepancies older than 7 days and still "New"
    const discrepancies = await WeightDiscrepancy.find({
      status: "new",
      createdAt: { $lte: sevenDaysAgo },
    });

    for (const discrepancy of discrepancies) {
      const user = await User.findById(discrepancy.userId);
      if (!user) {
        console.log(`User not found for discrepancy ${discrepancy.awbNumber}`);
        continue;
      }

      const wallet = await Wallet.findById(user.Wallet);
      if (!wallet) {
        console.log(`Wallet not found for user ${user._id}`);
        continue;
      }

      // Convert extraCharges to a number
      const extraCharges = parseFloat(
        discrepancy.excessWeightCharges?.excessCharges
      );
      console.log(
        `Processing discrepancy ${discrepancy.awbNumber}, Extra Charges: ${extraCharges}`
      );

      // Deduct balance (allowing it to go negative)
      wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));

      // Create and save transaction record
      const newTransaction = {
        channelOrderId: discrepancy.orderId,
        category: "debit",
        amount: extraCharges,
        balanceAfterTransaction: wallet.balance,
        awb_number: discrepancy.awbNumber,
        description: `Auto-accepted charge`,
      };

      wallet.transactions.push(newTransaction);
      await wallet.save();

      // Update discrepancy status
      discrepancy.status = "Accepted";
      discrepancy.clientStatus = "Auto Accepted";
      discrepancy.adminStatus = "Accepted";
      discrepancy.excessWeightCharges.pendingAmount = 0;
      await discrepancy.save();

      console.log(
        `Discrepancy ${discrepancy.awbNumber} auto-accepted. Wallet Balance: ${wallet.balance}`
      );
    }

    console.log("Auto-accept discrepancy job completed.");
  } catch (error) {
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
    console.log(req.body);
    console.log("Accepting discrepancy for AWB:", awbNumber);
    const discrepancy = await WeightDiscrepancy.findOne({ awbNumber });
    if (!discrepancy) {
      return res.status(404).json({ message: "Discrepancy not found" });
    }

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

module.exports = {
  downloadExcel,
  uploadDispreancy,
  AllDiscrepancy,
  AllDiscrepancyBasedId,
  AcceptDiscrepancy,
  AcceptAllDiscrepancies,
  raiseDiscrepancies,
  adminAcceptDiscrepancy,
  declineDiscrepancy,
};
