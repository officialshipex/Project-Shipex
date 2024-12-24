require('dotenv').config();
const axios = require('axios');
const Courier=require("../../../models/courierSecond");


const getAuthToken = async () => {

    const url = 'https://shipment.xpressbees.com/api/users/login';
    const payload = {
         email:process.env.XpreesbeesEmail,
         password:process.env.XpressbeesPassword
    };

    try {
        const response = await axios.post(url, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.data.status) {
            return response.data.data;
        }
        else {
            throw new Error(`Login failed: ${response.data.status}`);
        }
    }
    catch (error) {
        throw new Error(`Error in authentication: ${error.message}`);
    }

}

const saveXpressbees = async (req, res) => {
    try {
        const existingCourier = await Courier.findOne({ provider: 'Xpressbees' });

        if (existingCourier) {
            return res.status(400).json({ message: 'Xpressbees service is already added' });
        }

        const newCourier = new Courier({
            provider: 'Xpressbees'
        });
        await newCourier.save();
        res.status(201).json({ message: 'Xpressbees Integrated Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error.message });
    }
};

const isEnabeled = async (req, res) => {
    try {
      const existingCourier = await Courier.findOne({ provider: 'Xpressbees' });
      
  
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


module.exports={getAuthToken,saveXpressbees,isEnabeled}