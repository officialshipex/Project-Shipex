const ExcelJS = require("exceljs");
const xlsx = require("xlsx");
const fs=require("fs")
const Order=require("../models/newOrder.model")
const WeightDiscrepancy = require("./weightDispreancy.model");
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
      { header: "*Length", key: "Length", width: 20 },
      { header: "*Breadth", key: "Breadth", width: 20 },
      { header: "*Height", key: "Height", width: 20 },

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
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId=req.user._id
  
      // Read Excel File
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      for (const row of sheetData) {
        const awbNumber = row["*AWB Number"];
        const excessWeight = parseFloat(row["*Charge Weight"]); // Excess weight from file
  
        // Fetch order data from DB using awbNumber
        const order = await Order.findOne({ awb_number: awbNumber });
  
        if (!order) {
          console.log(`Order not found for AWB: ${awbNumber}`);
          continue; // Skip this iteration
        }
  
        // Create and save weight discrepancy entry
        const discrepancyEntry = new WeightDiscrepancy({
          userId:userId,  
          awbNumber: order.awb_number,
          orderId: order.orderId,
          productDetails: order.productDetails,
          courierServiceName: order.courierServiceName,
          provider: order.provider,
          enteredWeight: order.packageDetails.applicableWeight, // Weight from Order
          excessWeight: excessWeight, // Weight from File
        });
  
        await discrepancyEntry.save();
      }
  
      res.status(200).json({ message: "Weight discrepancies recorded successfully" });
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = { downloadExcel, uploadDispreancy };
