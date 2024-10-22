
const { AxiosError } = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

const { getSignature, validateGST, validatePAN, validateAadhaar, validateBankDetails, validateAccountNumber } = require('../utils/lib');
const BankAccount = require('../models/BankAccount.model');
const Aadhaar = require('../models/Aadhaar.model');
const Gstin = require('../models/Gstin.model');
const User = require('../models/User.model');
const Pan = require('../models/Pan.model');

dotenv.config();
const verfication = express.Router();
const cashfreeUrl = process.env.CASHFREE_URI;

/**
 * verify GSTIN number
 */
verfication.post('/gstin', async (req, res) => {
  try {

    const userId = req.user._id;
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
      url: `${cashfreeUrl}/gstin`,
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

/**
 * verify Pan number
 */
verfication.post('/pan', async (req, res) => {
  try {

    // const userId = req.user._id;
    const userId = "6711f5f10d7b30f7193c55fd";
    const { pan, name } = req.body;

    if (!pan) {
      return res.status(400).json({
        success: false,
        message: "pan  is required"
      });
    }

    const validatePan = validatePAN(pan);

    if (!validatePan) {
      return res.status(400).json({
        success: false,
        message: "Invalid pan"
      });
    }

    const panExists = await Pan.findOne({ pan });

    if (panExists) {
      return res.status(400).json({
        success: false,
        message: "Pan already exists",
      });
    }

    const data = JSON.stringify({
      "pan": pan,
      "name": name || ''
    });

    let signature = getSignature();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${cashfreeUrl}/pan`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-client-id': process.env.X_CLIENT_ID,
        'x-client-secret': process.env.X_CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2024-10-18",
      },
      data: data
    };

    const response = await axios.request(config);

    console.log("response:", response);

    if (!response || !response.data) {
      return res.status(500).json({
        success: false,
        message: 'Internal error'
      });
    }

    if (!response.data.valid) {
      return res.status(400).json({
        success: false,
        "pan": response.data.pan,
        "reference_id": response.data.reference_id,
        "name_provided": response.data.name_provided,
        "valid": response.data.valid,
        "message": response.data.message,
      });
    }

    const newPan = new Pan({
      user: userId,
      nameProvided: response.data.name_provided,
      pan: response.data.pan,
      registeredName: response.data.registered_name,
      panType: response.data.type,
      panRefId: response.data.reference_id,
    });

    await newPan.save();

    console.log("newPan:", newPan);

    return res.status(200).json({
      success: true,
      message: 'Pan verified successfully',
      data: newPan,
    });


  } catch (err) {

    console.log("err:", err);

    if (err instanceof AxiosError || err.response) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: err.response.data.message || 'Error in Pan verification'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * verify Aadhaar number, here we send the otp to the user's mobile number
 */
verfication.post('/generate-otp', async (req, res) => {
  try {

    // const userId = req.user._id;
    // const userId = "6711f5f10d7b30f7193c55fd";
    const { aadhaarNo } = req.body;

    if (!aadhaarNo) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required"
      });
    }

    const validateField = validateAadhaar(aadhaarNo);

    if (!validateField) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number"
      });
    }

    const aadhaarExists = await Aadhaar.findOne({ aadhaarNumber: aadhaarNo });

    if (aadhaarExists) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar already exists",
      });
    }

    const data = JSON.stringify({
      "aadhaar_number": aadhaarNo,
    });

    let signature = getSignature();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${cashfreeUrl}/offline-aadhaar/otp`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-client-id': process.env.X_CLIENT_ID,
        'x-client-secret': process.env.X_CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2024-10-18",
      },
      data: data
    };

    const response = await axios.request(config);

    if (response.data.status !== "SUCCESS") {
      return res.status(400).json({
        success: false,
        message: response.data.message,
      });
    }

    console.log("response:", response);

    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (err) {

    console.log("err:", err);

    if (err instanceof AxiosError || err.response) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: err.response.data.message || 'Error in Aadhaar verification'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * verify otp for Aadhaar number
 */
verfication.post('/verify-otp', async (req, res) => {
  try {

    // const userId = req.user._id;
    // const userId = "6711f5f10d7b30f7193c55fd";
    const { otp, refId } = req.body;

    if (!otp || !refId) {
      return res.status(400).json({
        success: false,
        message: "invalid is required"
      });
    }

    const data = JSON.stringify({
      "otp": otp,
      "ref_id": refId,
    });

    let signature = getSignature();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${cashfreeUrl}/offline-aadhaar/verify`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-client-id': process.env.X_CLIENT_ID,
        'x-client-secret': process.env.X_CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2024-10-18",
      },
      data: data
    };

    const response = await axios.request(config);

    console.log("response:", response);

    const newAadhaar = new Aadhaar({
      user: userId,
      aadhaarNumber: aadhaarNo,
      status: response.data.status,
      sonOf: response.data.care_of,
      dob: response.data.dob,
      email: response.data.email,
      gender: response.data.gender,
      address: response.data.address,
      name: response.data.name,
    })

    await newAadhaar.save();

    return res.status(200).json({
      success: true,
      data: newAadhaar,
    });

  } catch (err) {

    console.log("err:", err);

    if (err instanceof AxiosError || err.response) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: err.response.data.message || 'Error in Aadhaar verification'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * verify bank account
 */
verfication.post('/bank-account', async (req, res) => {
  try {

    // const userId = req.user._id;
    const userId = "6711f5f10d7b30f7193c55fd";

    const { accountNo, ifsc, name, phone } = req.body;

    if (!accountNo || !ifsc || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const validateField = validateBankDetails(accountNo, ifsc, name, phone);

    if (!validateField.valid) {
      return res.status(400).json({
        success: false,
        message: validateField.message
      });
    }

    const bankAccountExists = await BankAccount.findOne({ accountNumber: accountNo });

    if (bankAccountExists) {
      return res.status(400).json({
        success: false,
        message: "Bank Account already exists",
      });
    }

    const data = JSON.stringify({
      "bank_account": accountNo,
      "ifsc": ifsc,
      "name": name,
      "phone": phone,
    })

    let signature = getSignature();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${cashfreeUrl}/bank-account/sync`,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-client-id': process.env.X_CLIENT_ID,
        'x-client-secret': process.env.X_CLIENT_SECRET,
        "x-cf-signature": signature,
        "x-api-version": "2024-10-18",
      },
      data: data
    };

    const response = await axios.request(config);

    if (response.data.account_status === 'INVALID') {
      return res.status(400).json({
        success: false,
        message: response.data.account_status_code
      });
    }

    const newBankAccount = new BankAccount({
      user: userId,
      accountNumber: accountNo,
      nameProvided: name,
      ifsc: ifsc,
      AccountStatus: response.data.account_status,
      nameAtBank: response.data.name_at_bank,
      bank: response.data.bank_name,
      branch: response.data.branch,
      city: response.data.city,
      nameMatchResult: response.data.name_match_result,
    })

    await newBankAccount.save();

    return res.status(200).json({
      success: true,
      data: newBankAccount,
    });

  } catch (err) {
    console.log("err:", err);

    if (err instanceof AxiosError || err.response) {
      return res.status(err.response.status || 500).json({
        success: false,
        message: err.response.data.message || 'Error in Bank Account verification'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * delete GSTIN number , pan, aadhaar, bank account
 */

verfication.delete('/gstin', async (req, res) => {
  try {
    const { gstin } = req.body;

    if (!gstin) {
      return res.status(400).json({
        success: false,
        message: "GSTIN is required"
      });
    }

    const validateGstin = validateGST(gstin);
    if (!validateGstin) {
      return res.status(400).json({
        success: false,
        message: "Invalid GSTIN"
      });
    }

    const gstinExists = await Gstin.findOne({ gstin });

    if (!gstinExists) {
      return res.status(400).json({
        success: false,
        message: "GSTIN does not exists"
      });
    }

    await Gstin.findOneAndDelete({ gstin });

    return res.status(200).json({
      success: true,
      message: "GSTIN deleted successfully"
    });

  } catch (err) {
    console.log("err:", err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

verfication.delete('/pan', async (req, res) => {
  try {
    const { pan } = req.body;

    if (!pan) {
      return res.status(400).json({
        success: false,
        message: "Pan is required"
      });
    }

    const validatePan = validatePAN(pan);
    if (!validatePan) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pan"
      });
    }

    const panExists = await Pan.findOne({ pan });

    if (!panExists) {
      return res.status(400).json({
        success: false,
        message: "Pan does not exists"
      });
    }

    await Pan.findOneAndDelete({ pan });

    return res.status(200).json({
      success: true,
      message: "Pan deleted successfully"
    });

  } catch (err) {
    console.log("err:", err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
})

verfication.delete('/aadhaar', async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required"
      });
    }

    const validateField = validateAadhaar(aadhaarNumber);
    if (!validateField) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number"
      });
    }

    const aadhaarExists = await Aadhaar.findOne({ aadhaarNumber });

    if (!aadhaarExists) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar does not exists"
      });
    }

    await Aadhaar.findOneAndDelete({ aadhaarNumber });

    return res.status(200).json({
      success: true,
      message: "Aadhaar deleted successfully"
    });

  } catch (err) {
    console.log("err:", err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

verfication.delete('/bank-account', async (req, res) => {
  try {
    const { accountNumber } = req.body;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Account number is required"
      });
    }

    const validateField = validateAccountNumber(accountNumber);
    if (!validateField.valid) {
      return res.status(400).json({
        success: false,
        message: validateField.message
      });
    }

    const bankAccountExists = await BankAccount.findOne({ accountNumber });

    if (!bankAccountExists) {
      return res.status(400).json({
        success: false,
        message: "Bank Account does not exists"
      });
    }

    await BankAccount.findOneAndDelete({ accountNumber });

    return res.status(200).json({
      success: true,
      message: "Bank Account deleted successfully"
    });

  } catch (err) {
    console.log("err:", err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = verfication;