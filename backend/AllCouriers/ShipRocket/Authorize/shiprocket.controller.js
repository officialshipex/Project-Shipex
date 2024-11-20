const axios = require("axios");
const Courier = require("../../../models/courierSecond");

const saveShipRocket = async () => {
    try {
        const newCourier = new Courier({ provider: "Shiprocket" });
        await newCourier.save();
        return newCourier;
    } catch (error) {
        throw new Error("Failed to save credentials in the database: " + error?.message);
    }
};

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

module.exports = { saveShipRocket, getToken };
