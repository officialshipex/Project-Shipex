const express = require("express");
const axios = require("axios");
require("dotenv").config();

// const router = express.Router();

// DTDC API Configuration from environment variables
const DTDC_API_URL = process.env.DTDC_API_URL;
const API_KEY = process.env.DTDC_API_KEY;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;

// Create a new shipment
const createOrder = async (req, res) => {
  try {
    // Log headers for debugging
    console.log("API Key:", API_KEY);
    console.log("Access Token:", X_ACCESS_TOKEN);

    const shipmentData = {
      consignments: [
        {
          customer_code: req.body.customer_code,
          service_type_id: req.body.service_type_id,
          load_type: req.body.load_type,
          description: req.body.description,
          dimension_unit: "cm",
          length: req.body.length,
          width: req.body.width,
          height: req.body.height,
          weight_unit: "kg",
          weight: req.body.weight,
          declared_value: req.body.declared_value,
          num_pieces: req.body.num_pieces,
          origin_details: req.body.origin_details,
          destination_details: req.body.destination_details,
          return_details: req.body.return_details,
          customer_reference_number: req.body.customer_reference_number,
          cod_collection_mode: req.body.cod_collection_mode || "",
          cod_amount: req.body.cod_amount || "",
          commodity_id: req.body.commodity_id,
          eway_bill: req.body.eway_bill,
          is_risk_surcharge_applicable: req.body.is_risk_surcharge_applicable || false,
          invoice_number: req.body.invoice_number,
          invoice_date: req.body.invoice_date,
          reference_number: req.body.reference_number || ""
        }
      ]
    };

    // API Call with Proper Authorization Header
    const response = await axios.post(
      `${DTDC_API_URL}/customer/integration/consignment/softdata`,
      shipmentData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          "Authorization": `Bearer ${X_ACCESS_TOKEN}`
        }
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error creating shipment:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to create shipment", error: error.response?.data || error.message });
  }
};



// DTDC API Configuration from environment variables
const DTDC_CANCEL_API_URL = `${DTDC_API_URL}/customer/integration/consignment/cancel`;

// Cancel a shipment
const cancelOrderDTDC = async (req, res) => {
  try {
    const { AWBNo, customerCode } = req.body;

    if (!AWBNo || !Array.isArray(AWBNo) || AWBNo.length === 0) {
      return res.status(400).json({ success: false, message: "AWBNo is required and should be a non-empty array." });
    }

    if (!customerCode) {
      return res.status(400).json({ success: false, message: "customerCode is required." });
    }

    const requestData = { AWBNo, customerCode };

    // API Call with Proper Authorization Header
    const response = await axios.post(DTDC_CANCEL_API_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY
      }
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error canceling shipment:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to cancel shipment",
      error: error.response?.data || error.message
    });
  }
};






// DTDC Tracking API Config
const DTDC_TRACKING_API_URL = `${DTDC_API_URL}/customer/integration/consignment/track` // Example: "http://dtdcapi.shipsy.io/api/customer/integration/consignment/track"


// Track Order Controller
const trackOrderDTDC = async (req, res) => {
  try {
    const { AWBNo } = req.body;

    // Validate Input
    if (!AWBNo || !Array.isArray(AWBNo) || AWBNo.length === 0) {
      return res.status(400).json({ success: false, message: "AWBNo is required and should be a non-empty array." });
    }

    const requestData = { AWBNo };

    // API Call with Proper Headers
    const response = await axios.post(DTDC_TRACKING_API_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY
      }
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error tracking shipment:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to track shipment",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {createOrder, cancelOrderDTDC, trackOrderDTDC};
