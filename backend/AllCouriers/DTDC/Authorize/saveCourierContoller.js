if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const axios = require('axios');
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const AllCourier=require("../../../models/AllCourierSchema");

const API_TOKEN = process.env.DTDC_API_KEY

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


const saveDtdc = async (req, res) => {
    try {
        const existingCourier = await Courier.findOne({ provider: 'Dtdc' });

        if (existingCourier) {
            return res.status(400).json({ message: 'Dtdc service is already added' });
        }

        const newCourier = new Courier({
            provider: 'Dtdc'
        });
        await newCourier.save();
        res.status(201).json({ message: 'Dtdc Integrated Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error.message });
    }
};



module.exports={getToken, saveDtdc}