require('dotenv').config(); 
const axios = require("axios");
const Courier = require("../../../models/courierSecond");

const getToken = async () => {
    const email = process.env.SHIPR_GMAIL;
    const password = process.env.SHIPR_PASS;

    if (!email || !password) {
        throw new Error("Email and password are required as environment variables.");
    }

    try {
        const options = {
            method: "POST",
            url: "https://apiv2.shiprocket.in/v1/external/auth/login",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: { email, password },
        };

        const response = await axios.request(options);

        if (response.status === 200 && response.data.token) {
            return response.data.token;
        } else {
            throw new Error(`Login failed: Status ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            throw new Error(`Error in authentication: ${error.response.data.message || error.message}`);
        } else {
            throw new Error(`Error in authentication: ${error.message}`);
        }
    }
};



const saveShipRocket = async (req, res) => {
   
    console.log("I am in shiprocket");
    try {
        const existingCourier = await Courier.findOne({ provider: 'Shiprocket' });

        if (existingCourier) {
            return res.status(400).json({ message: 'Shiprocket service is already added' });
        }

        const newCourier = new Courier({
            provider: 'Shiprocket'
        });
        await newCourier.save();
        res.status(201).json({ message: 'Shiprocket Integrated Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error.message });
    }
};

const isEnabeled = async (req, res) => {
    try {
      const existingCourier = await Courier.findOne({ provider: 'Shiprocket' });
      
  
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

  const disable = async (req, res) => {

    try {
      const existingCourier = await Courier.findOne({ provider: 'Shiprocket'});
  
      if (!existingCourier) {
        return res.status(404).json({ isEnabeled: false, message: "Courier not found" });
      }
  
      existingCourier.isEnabeled = true;
      existingCourier.toEnabeled = true;
      const result=await existingCourier.save();
      return res.status(201).json({ isEnabeled: true, toEnabeled:true});
    }
    catch (error) {
      onsole.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  
  }


module.exports = { saveShipRocket, getToken, isEnabeled, disable };
