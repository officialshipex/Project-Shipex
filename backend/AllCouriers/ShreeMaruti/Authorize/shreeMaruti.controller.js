require('dotenv').config();
const axios = require('axios');
const Courier=require("../../../models/courierSecond");


// Configuration (replace with actual values)
const BASE_URL = 'https://qaapis.delcaper.com'; // Replace with the actual base URL

const saveShreeMaruti = async (req, res) => {
    console.log("I am in shreeMaruti");
    try {
        const existingCourier = await Courier.findOne({ provider: 'ShreeMaruti' });

        if (existingCourier) {
            return res.status(400).json({ message: 'ShreeMaruti service is already added' });
        }

        const newCourier = new Courier({
            provider: 'ShreeMaruti'
        });
        await newCourier.save();
        res.status(201).json({ message: 'ShreeMaruti Integrated Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error.message });
    }
};


const isEnabeled = async (req, res) => {
    try {
      const existingCourier = await Courier.findOne({ provider: 'ShreeMaruti' });
      
  
      if (!existingCourier) {
        return res.status(404).json({ isEnabeled: false, message: "Courier not found" });
      }
  
      if (existingCourier.isEnabeled) {
        return res.status(201).json({ isEnabeled: true });
      } else {
        return res.status(200).json({ isEnabeled: false });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };



  const getToken = async () => {
    const email = process.env.SHREEMA_GMAIL;
    const password = process.env.SHREEMA_PASS;
    const vendorType = "SELLER";

    if (!email || !password) {
        throw new Error("Email and password environment variables are required.");
    }

    try {
        const options = {
            method: "POST",
            url: "https://qaapis.delcaper.com/auth/login",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: { email, password, vendorType },
        };

        const response = await axios.request(options);

        if (response.status === 200 && response.data.data.accessToken) {
            return response.data.data.accessToken;
        } else {
            throw new Error(`Login failed: ${response.status}`);
        }
    } catch (error) {
        console.error("Response error:", error.response?.data || error.message);
        throw new Error(`Error in authentication: ${error.message}`);
    }
};


module.exports ={saveShreeMaruti,getToken,isEnabeled} ;