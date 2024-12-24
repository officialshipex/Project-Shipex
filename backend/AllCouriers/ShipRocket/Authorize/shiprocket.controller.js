require('dotenv').config(); 
const axios = require("axios");
const Courier = require("../../../models/courierSecond");


const getToken = async () => {
    const email=process.env.SHIPR_GMAIL;
    const password=process.env.SHIPR_PASS;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
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
         
        if(response.status){
            return response.data.token;
        }
            else {
                throw new Error(`Login failed: ${response.status}`);
            }
       
    } catch (error) {
        throw new Error(`Error in authentication: ${error.message}`);
    }
};


const saveShipRocket = async (req, res) => {
   
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


module.exports = { saveShipRocket, getToken };
