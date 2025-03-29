if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
    }

    const axios = require('axios');
    const AllCourier=require("../../../models/AllCourierSchema");

const API_TOKEN = process.env.AMAZON_API_TOKEN;
const getToken = async (req, res) => {
    const { apiKey } = req.body.credentials;  // Destructure apiKey from the request body
    const { courierName, courierProvider, CODDays, status } = req.body;  // Destructure courier data from the request body

    // Validate if the API token matches the provided apiKey
    if (API_TOKEN !== apiKey) {
        // If the token does not match, return an unauthorized response
        return res.status(401).json({ message: 'Unauthorized access. Invalid API key.' });
    }

    const courierData = {
        courierName,
        courierProvider,
        CODDays,
        status,
    };

    try {
        // Create a new courier entry in the database
        const newCourier = new AllCourier(courierData);
        await newCourier.save();

        // Return a success response with the newly created courier data
        return res.status(201).json({
            message: 'Courier successfully added.',
            courier: newCourier,
        });
    } catch (error) {
        // Handle errors gracefully and return a detailed error message
        return res.status(500).json({
            message: 'Failed to add courier.',
            error: error.message,
        });
    }
};



const getAccessToken = async () => {
  try {
    const response = await axios.post("https://api.amazon.com/auth/o2/token", {
      grant_type: "refresh_token",
      refresh_token: process.env.SPAPI_REFRESH_TOKEN,
      client_id: process.env.SPAPI_CLIENT_ID,
      client_secret: process.env.SPAPI_CLIENT_SECRET,
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching SP-API token:", error.response.data);
  }
};


module.exports={getToken,getAccessToken}