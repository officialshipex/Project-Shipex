const ExcelJS = require("exceljs");
const xlsx = require("xlsx");
const fs=require("fs")
const Order=require("../models/newOrder.model")
const WeightDiscrepancy = require("./weightDispreancy.model");
const Wallet=require("../models/wallet")
const User=require("../models/User.model")
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
            return res.status(400).json({ success: false, error: "No file uploaded" });
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
            const length = row["Length"];
            const breadth = row["Breadth"];
            const height = row["Height"];

            // Fetch order data from DB using awbNumber
            const order = await Order.findOne({ awb_number: awbNumber });

            if (!order) {
                console.log(`Order not found for AWB: ${awbNumber}`);
                continue; // Skip this iteration
            }

            const excessWeight = chargeWeight - order.packageDetails.applicableWeight;
            const freightCharges = order.totalFreightCharges;
            const extraWeight = Math.ceil(excessWeight / order.packageDetails.applicableWeight);
            const excessCharges = freightCharges * extraWeight;

            // Check if an existing discrepancy exists
            let discrepancyEntry = await WeightDiscrepancy.findOne({ awbNumber });

            if (discrepancyEntry) {
                // **Update existing discrepancy**
                discrepancyEntry.chargedWeight = {
                    applicableWeight: chargeWeight,
                    deadWeight: chargeWeight
                };
                discrepancyEntry.chargeDimension = {
                    length,
                    breadth,
                    height
                };
                discrepancyEntry.excessWeightCharges = {
                    excessWeight,
                    excessCharges,
                    pendingAmount: excessCharges
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
                    courierServiceName: order.courierServiceName,
                    provider: order.provider,
                    enteredWeight: {
                        applicableWeight: order.packageDetails.applicableWeight,
                        deadWeight: order.packageDetails.deadWeight
                    },
                    chargedWeight: {
                        applicableWeight: chargeWeight,
                        deadWeight: chargeWeight
                    },
                    chargeDimension: {
                        length,
                        breadth,
                        height
                    },
                    excessWeightCharges: {
                        excessWeight,
                        excessCharges,
                        pendingAmount: excessCharges
                    },
                    status: "new",
                    adminStatus: "pending"
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

        res.status(200).json({ success: true, message: "Weight discrepancies recorded successfully" });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const AllDiscrepancy = async (req, res) => {
    try {
        const allDiscrepancies = await WeightDiscrepancy.find();

        if (!allDiscrepancies.length) {
            return res.status(404).json({ success: false, message: "No discrepancies found" });
        }

        res.status(200).json({ success: true, data: allDiscrepancies });
    } catch (error) {
        console.error("Error fetching discrepancies:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

const AllDiscrepancyBasedId = async (req, res) => {
    try {
        const id=req.user._id
        // console.log(id)
        const allDiscrepancies = await WeightDiscrepancy.find({userId:id});
        // console.log(allDiscrepancies)

        if (!allDiscrepancies.length) {
            return res.status(404).json({ success: false, message: "No discrepancies found" });
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
      const discrepancies = await WeightDiscrepancy.findOne({ awbNumber: awb_number });
      if (!discrepancies) {
        return res.status(404).json({ success: false, message: "Discrepancy not found" });
      }
  
      const extraCharges = discrepancies.excessWeightCharges.excessCharges || 0;
      console.log("Extra Charges:", extraCharges);
  
      // Fetch user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Fetch user's wallet
      const wallet = await Wallet.findById(user.Wallet);
      if (!wallet) {
        return res.status(404).json({ success: false, message: "Wallet not found" });
      }
  
      console.log("Wallet Balance:", wallet.balance);
  
      // Validate if the user has sufficient balance
      if (wallet.balance < extraCharges) {
        return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
      }
  
      // Deduct extra charges from wallet balance
      wallet.balance -= extraCharges;
      await wallet.save();
  
      // Update discrepancy status
      discrepancies.status = "Accepted";
      discrepancies.clientStatus="Accept by Client";
      discrepancies.excessWeightCharges.pendingAmount = 0;
      await discrepancies.save();
  
      return res.status(200).json({
        success: true,
        message: "Discrepancy accepted, wallet balance updated",
        updatedWalletBalance: wallet.balance,
      });
  
    } catch (error) {
      console.error("Error in AcceptDiscrepancy:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  };
  

module.exports = { downloadExcel, uploadDispreancy,AllDiscrepancy,AllDiscrepancyBasedId,AcceptDiscrepancy };
