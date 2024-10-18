const { AxiosError } = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

const { getSignature, validateGST } = require('../utils/lib');
const Gstin = require('../models/Gstin.model');
const User = require('../models/User.model');

const verfication = express.Router();
dotenv.config();

verfication.post('/gstin', async (req, res) => {
  try {

    // const userId = req.user._id;
    const { GSTIN, businessName } = req.body;

    if (!GSTIN) {
      return res.status(400).json({
        success: false,
        message: "GSTIN is required"
      });
    }

    const validateGstin = validateGST(GSTIN);

    if (!validateGstin) {
      return res.status(400).json({
        success: false,
        message: "Invalid GSTIN"
      });
    }

    const gstinExists = await Gstin.findOne({ gstin: GSTIN });

    if (gstinExists) {
      return res.status(400).json({
        success: false,
        message: "GSTIN already exists",
      });
    }

    const data = JSON.stringify({
      "GSTIN": GSTIN,
      "businessName": businessName || ''
    });

    let signature = getSignature();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.cashfree.com/verification/gstin',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-client-id': process.env.X_CLIENT_ID,
        'x-client-secret': process.env.X_CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2022-10-26",
      },
      data: data
    };

    const response = await axios.request(config);

    if (!response || !response.data) {
      return res.status(500).json({
        success: false,
        message: 'Internal error'
      });
    }

    if (response.data.message !== 'GSTIN Exists') {
      return res.status(response.status).json({
        success: false,
        message: response.data.message
      });
    }

    const newGstin = new Gstin({
      user: userId,
      gstin: response.data.GSTIN,
      nameOfBusiness: response.data.legal_name_of_business,
      referenceId: response.data.reference_id,
      legalNameOfBusiness: response.data.legal_name_of_business,
      taxPayerType: response.data.taxpayer_type,
      gstInStatus: response.data.gst_in_status,
      dateOfRegistration: response.data.date_of_registration,
    });

    await newGstin.save();

    console.log("newGstin:", newGstin);

    return res.status(200).json({
      success: true,
      message: 'GSTIN verified successfully',
      data: newGstin
    });

  } catch (err) {

    console.log("err:", err);

    if (err instanceof AxiosError || err.response) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: err.response.data.message || 'Error in GSTIN verification'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = verfication;