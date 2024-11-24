require('dotenv').config();
const axios = require('axios');
const Courier = require("../../../models/courierSecond");


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

const saveXpressbees = async () => {
    try {
        const newCourier = new Courier({ provider: "Xpressbees" });
        await newCourier.save();
        return newCourier;
    } catch (error) {
        throw new Error("Failed to save credentials in the database: " + error?.message);
    }
};

module.exports={getAuthToken,saveXpressbees}