const ExcelJS = require("exceljs");
const xlsx = require("xlsx");
const fs = require("fs");
const Order = require("../models/newOrder.model");
const WeightDiscrepancy = require("./weightDispreancy.model");
const Wallet = require("../models/wallet");
const User = require("../models/User.model");
const cron = require("node-cron");
const downloadExcel = async (req, res) => {
  // console.log("hii")
  try {
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Bulk Order");

    // Define headers
    worksheet.columns = [
      { header: "*AWB Number", key: "AWB_Number", width: 30 },
      { header: "*Charge Weight", key: "Charge_Weight", width: 40 },
      { header: "Length", key: "Length", width: 20 },
      { header: "Breadth", key: "Breadth", width: 20 },
      { header: "Height", key: "Height", width: 20 },

      // { header: "*CODAmount", key: "CODAmount", width: 40 },
    ];

    // Add a sample row with mandatory product 1 and optional products
    worksheet.addRow({
      AWB_Number: "1212121212",
      Charge_Weight: "0.5",
      Length: "10",
      Breadth: "10",
      Height: "10",
    });

    // Format the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true }; // Make headers bold
    });

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");

    // Write workbook to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res
      .status(500)
      .json({ error: "Error generating Excel file", details: error.message });
  }
};

const uploadDispreancy = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const userId = req.user._id;
    const filePath = req.file.path; // Path of the uploaded file

    // Read Excel File
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheetData) {
      const awbNumber = row["*AWB Number"];
      const chargeWeight = parseFloat(row["*Charge Weight"]);

      // Ensure AWB Number and Charge Weight are mandatory
      if (!awbNumber || isNaN(chargeWeight)) {
        console.log(`Skipping row due to missing mandatory fields:`, row);
        continue; // Skip this row
      }

      // Handle LBH values (if missing, set to null or 0)
      const length = row["Length"] ? parseFloat(row["Length"]) : null;
      const breadth = row["Breadth"] ? parseFloat(row["Breadth"]) : null;
      const height = row["Height"] ? parseFloat(row["Height"]) : null;

      // Fetch order data from DB using awbNumber
      const order = await Order.findOne({ awb_number: awbNumber });
      console.log("roere",order.awb_number)

      if (!order) {
        console.log(`Order not found for AWB: ${awbNumber}`);
        continue; // Skip this iteration
      }

      const excessWeight = chargeWeight - order.packageDetails.applicableWeight;
      const freightCharges = order.totalFreightCharges;
      const extraWeight = Math.ceil(
        excessWeight / order.packageDetails.applicableWeight
      );
      const excessCharges = freightCharges * extraWeight;

      // Check if an existing discrepancy exists
      let discrepancyEntry = await WeightDiscrepancy.findOne({ awbNumber });

      if (discrepancyEntry) {
        // **Update existing discrepancy**
        discrepancyEntry.chargedWeight = {
          applicableWeight: chargeWeight,
          deadWeight: chargeWeight,
        };
        discrepancyEntry.chargeDimension = {
          length,
          breadth,
          height,
        };
        discrepancyEntry.excessWeightCharges = {
          excessWeight,
          excessCharges,
          pendingAmount: excessCharges,
        };
        discrepancyEntry.status = "new";
        discrepancyEntry.adminStatus = "pending";
        discrepancyEntry.updatedAt = new Date();
      } else {
        // **Create new discrepancy entry**
        discrepancyEntry = new WeightDiscrepancy({
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
            applicableWeight: chargeWeight,
            deadWeight: chargeWeight,
          },
          chargeDimension: {
            length,
            breadth,
            height,
          },
          excessWeightCharges: {
            excessWeight,
            excessCharges,
            pendingAmount: excessCharges,
          },
          status: "new",
          adminStatus: "pending",
        });
      }

      await discrepancyEntry.save();
    }

    // Delete the uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully:", filePath);
      }
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

    const extraCharges = discrepancies.excessWeightCharges.excessCharges || 0;
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

    console.log("Wallet Balance:", wallet.balance);

    // Validate if the user has sufficient balance
    if (wallet.balance < extraCharges) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // Deduct extra charges from wallet balance
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

    console.log("Wallet Balance:", wallet.balance);

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

      const extraCharges = discrepancy.excessWeightCharges.excessCharges || 0;
      totalExtraCharges += extraCharges;

      // Store discrepancies for later updates
      discrepanciesToUpdate.push({ discrepancy, extraCharges });
    }

    // Validate if the user has sufficient balance
    if (wallet.balance < totalExtraCharges) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient wallet balance" });
    }

    // Deduct total extra charges from wallet balance
    wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));

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
      await wallet.save();

      // Update discrepancy status
      discrepancy.status = "Accepted";
      discrepancy.clientStatus = "Accepted by Client";
      discrepancy.adminStatus = "Accepted";
      discrepancy.excessWeightCharges.pendingAmount = 0;
      await discrepancy.save();
    }

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

      const extraCharges = discrepancy.excessWeightCharges?.excessCharges || 0;
      console.log(
        `Processing discrepancy ${discrepancy.awbNumber}, Extra Charges: ${extraCharges}`
      );

      if (wallet.balance < extraCharges) {
        console.log(`Insufficient balance for user ${user._id}, skipping...`);
        continue;
      }

      // Deduct balance
      wallet.balance = parseFloat((wallet.balance - extraCharges).toFixed(2));

      // Create and save transaction record
      const newTransaction = {
        channelOrderId: discrepancies.orderId,
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

      console.log(`Discrepancy ${discrepancy.awbNumber} auto-accepted.`);
    }

    console.log("Auto-accept discrepancy job completed.");
  } catch (error) {
    console.error("Error in autoAcceptDiscrepancies:", error);
  }
};

// Schedule job to run every day at midnight
cron.schedule("0 0 * * *", autoAcceptDiscrepancies);

module.exports = {
  downloadExcel,
  uploadDispreancy,
  AllDiscrepancy,
  AllDiscrepancyBasedId,
  AcceptDiscrepancy,
  AcceptAllDiscrepancies,
};
