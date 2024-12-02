const axios = require('axios');
const Courier = require("../../models/courierSecond");
const dtdcCourierPartner = require('../models/courierPartners.model');
const dtdcConsignment = require('../models/dtdcOrder.model')

require('dotenv').config();


const saveDtdcCourier = async () => {
    try {
        const newCourier = new Courier({ provider: "DTDC" });
        await newCourier.save();
        return newCourier;
        // return res.json(newCourier);
    } catch (error) {
        throw new Error("Failed to save credentials in the database: " + error?.message);
    }
}

const getPincodeInfo = async(req,res) => {
    try {
      const pincodes = req.body
      const url = 'http://smarttrack.ctbsplus.dtdc.com/ratecalapi/PincodeApiCall';

        const response = await axios.post(
          url,
          pincodes,
          { headers : {
          'Content-Type': 'application/json',
          }}
        );

        // Save response to MongoDB
        const dtdcCourierPartners = new dtdcCourierPartner({
            orgPincode : req.body.orgPincode,
            desPincode : req.body.desPincode,
            responseBody: response.data,
        });

        await dtdcCourierPartners.save();

        console.log('Response saved to MongoDB:', response.data);

        return  res.json({
            status: response.status,
            body: response.data,
        });
    } catch (error) {
        return res.json({
            status: 500,
            body: error.message,
        });
    }
}

const createNewShipment = async(req,res) => {
  try {
    const consignmentData = req.body;
    const dtdcApiUrl = process.env.BASE_URL;
 
      const response = await axios.post(
        `${dtdcApiUrl}/customer/integration/consignment/softdata`,
        consignmentData ,
        { headers: {
           'Content-Type': 'application/json',
            'api-key':process.env.DTDC_API_KEY
          } 
        }
      );
        // Save response to MongoDB
        const newResponse = new dtdcConsignment({
            status: response.data.status,
            data: response.data.data
        });

        await newResponse.save();

      console.log('Response saved to MongoDB:', newResponse);


      return res.json(response.data);

      } catch (error) {
        console.error('Error creating consignment:', error.message);
        return res.status(500).json({
          message: 'Failed to create consignment',
          error: error.message,
      });
    } 
}

const cancelShipment = async(req,res) => {
    try {
        const consignmentData = req.body;
        const dtdcApiUrl = process.env.BASE_URL;

        const response = await axios.post(
          `${dtdcApiUrl}/customer/integration/consignment/cancel`,
          consignmentData ,
          { headers: {
            'Content-Type': 'application/json',
            'api-key':process.env.DTDC_API_KEY
            } 
          }
        );
        return res.json({
            status: response.status,
            body: response.data,
        });
    } catch (error) {
        return res.json({
            status: 500,
            body: error.message,
        });
    }
}

const getShippingLabel = async (req, res) => {
  try {
      const { reference_number, label_code, label_format } = req.query;

      if (!reference_number || !label_code || !label_format) {
          return res.status(400).json({
              message: "Missing required parameters: reference_number, label_code, or label_format",
          });
      }

      const apiUrl = `${process.env.BASE_URL}/customer/integration/consignment/shippinglabel/stream?reference_number=${reference_number}&label_code=${label_code}&label_format=${label_format}`;

      const response = await axios.get(apiUrl, {
          headers: {
              'Content-Type': 'application/json', 
              'api-key': process.env.DTDC_API_KEY,
          },
          responseType: 'arraybuffer', // Fetch response as binary data
      });

      // Set the appropriate headers for returning a PDF file
      res.set({
          'Content-Type': 'application/pdf', // Response is a PDF file
          'Content-Disposition': `inline; filename="shipping_label_${reference_number}.pdf"`, // Display in browser or Postman
      });

      // Send the binary PDF data to the client
      return res.send(response.data);
  } catch (error) {
      console.error("Error fetching shipping label:", error.message);
      return res.status(500).json({
          message: "Failed to fetch shipping label",
          error: error.message,
      });
  }
};


const getTrackingStatus = async (req,res) => {
    try {
        const trackingData = req.body;
        // trackingApiUrl = 'https://dtdcstagingapi.dtdc.com/dtdc-tracking-api/dtdc-api/rest/JSONCnTrk/getTrackDetails'
        trackingApiUrl = process.env.DTDC_TRACKING_URL;

        const response = await axios.post(
              trackingApiUrl,
              trackingData,
              {headers : {
                'Content-Type': 'application/json',
                'x-access-token': process.env.DTDC_X_ACCESS_TOKEN,
                }
              });
        return res.json({
            status: response.status,
            body: response.data,
        });
    } catch (error) {
        return res.json({
            status: 500,
            body: error.message,
        });
    }
}

module.exports = {
    saveDtdcCourier,
    getPincodeInfo,
    createNewShipment,
    cancelShipment,
    getShippingLabel,
    getTrackingStatus,
};
