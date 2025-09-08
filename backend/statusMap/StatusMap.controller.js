const axios = require("axios");
require("dotenv").config();
const courier = require("../models/AllCourierSchema");
const readXlsxFile = require("read-excel-file/node");
const path = require("path");
const StatusMap = require("./StatusMap.model");

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
      const partner = rowObject.partnerName;

      if (!groupedData[partner]) {
        groupedData[partner] = {
          partnerName: partner,
          data: [],
        };
      }
      groupedData[partner].data.push(rowObject);
    });

    // groupedData now contains one object per partnerName with array of related rows
    // console.log(groupedData);

    // Example to save each partner group as one record in DB:

    for (const partner in groupedData) {
      await StatusMap.create(groupedData[partner]);
    }

    res.send("File processed and grouped data created");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error processing file");
  }
};

module.exports = { fetchCourier, uploadExcel };
