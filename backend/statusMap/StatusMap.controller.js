const axios = require("axios");
require("dotenv").config();
const courier = require("../models/AllCourierSchema");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const excelJS = require("exceljs");
const StatusMap = require("./StatusMap.model");
const fs = require("fs");

const fetchPartnerName = async (req, res) => {
  try {
    const allStatus = await StatusMap.find();

    if (!allStatus || allStatus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No partner name found",
      });
    }

    // Extract partnerName values into an array, removing duplicates if needed
    const partnerNames = [
      ...new Set(allStatus.map((item) => item.partnerName)),
    ];

    // console.log("partner",partnerNames)

    res.status(200).json({
      success: true,
      data: allStatus, // array of partnerName strings
    });
  } catch (error) {
    console.error("Error fetching couriers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching couriers",
      error: error.message,
    });
  }
};

const uploadExcel = async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  const filePath = path.resolve(req.file.path);

  try {
    const rows = await readXlsxFile(filePath);
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Group by partnerName
    const groupedData = {};
    dataRows.forEach((row) => {
      const rowObject = Object.fromEntries(
        headers.map((key, i) => [key, row[i]])
      );
      const partner = rowObject.partnerName?.trim();
      if (!partner) return;
      if (!groupedData[partner]) {
        groupedData[partner] = {
          partnerName: partner,
          data: [],
        };
      }
      groupedData[partner].data.push(rowObject);
    });

    // For each partner: delete existing, add new
    for (const partner in groupedData) {
      // Delete previous records for this partner
      await StatusMap.deleteMany({ partnerName: partner });

      // Insert new record(s) for this partner
      await StatusMap.create(groupedData[partner]);
    }

    // Delete file after success
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("Uploaded file deleted successfully.");
    });

    return res.status(200).json({
      success: true,
      message: "File processed and partners replaced successfully",
    });
  } catch (e) {
    console.error(e);
    // Cleanup file on error
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file after failure:", err);
    });

    return res.status(500).json({
      success: false,
      message: "Error processing file",
      error: e.message,
    });
  }
};

const getStatusByPartnerName = async (req, res) => {
  // console.log("hii",req.query)
  const { courierProvider } = req.query;
  if (!courierProvider) {
    return res.status(400).json({ error: "partnerName is required" });
  }
  try {
    // Find documents where partnerName matches (case-sensitive by default)
    const records = await StatusMap.find({
      partnerName: courierProvider.toUpperCase(),
    });
    // console.log("recco",records)
    return res.json({ courierProvider, data: records });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const exportStatusMap = async (req, res) => {
  const { courierProvider } = req.query;
  try {
    // Find the document, assuming the collection shape as you showed
    const doc = await StatusMap.findOne({
      partnerName: courierProvider,
    }).lean();
    if (!doc || !doc.data || !doc.data.length) {
      return res.status(404).json({ message: "No data found" });
    }

    // Get all keys from the first object in the data array, except for __v if present
    const allKeys = Object.keys(doc.data[0]).filter((k) => k !== "__v");
    const columns = allKeys.map((key) => ({ header: key, key, width: 20 }));

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("StatusMap");
    worksheet.columns = columns;

    // Add each row from doc.data
    doc.data.forEach((item) => {
      const row = allKeys.map((colKey) => item[colKey]);
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=statusMap-${courierProvider}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Export failed", error });
  }
};

module.exports = {
  fetchPartnerName,
  uploadExcel,
  getStatusByPartnerName,
  exportStatusMap,
};
