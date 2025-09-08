const axios = require("axios");
require("dotenv").config();
const courier = require("../models/AllCourierSchema");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const StatusMap = require("./StatusMap.model");
const fs = require("fs");

const fetchCourier = async (req, res) => {
  try {
    const allCourier = await courier.find({ status: "Enable" });

    if (!allCourier || allCourier.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No couriers found with status 'Enable'",
      });
    }

    res.status(200).json({
      success: true,
      data: allCourier,
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

    // Create a map to group by partnerName
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

    // Check if any partner already exists
    for (const partner in groupedData) {
      const exists = await StatusMap.findOne({ partnerName: partner });
      if (exists) {
        // ✅ Delete file before returning
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
          else console.log("Uploaded file deleted (duplicate partner).");
        });

        return res.status(400).json({
          success: false,
          message: `Partner "${partner}" already exists`,
        });
      }
    }

    // Save all new partners
    for (const partner in groupedData) {
      await StatusMap.create(groupedData[partner]);
    }

    // ✅ Delete file after success
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("Uploaded file deleted successfully.");
    });

    return res.status(200).json({
      success: true,
      message: "File processed successfully",
    });
  } catch (e) {
    console.error(e);

    // Cleanup file on error too
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

module.exports = { fetchCourier, uploadExcel };
