require('dotenv').config({ path: "../../../../.env" }); 
const axios = require('axios');
const B2Bcourier=require("../../../../models/B2Bcourier");

const getToken= async () => {
    const url = 'https://ship.nimbuspost.com/api/users/login';

    const payload = {
        email: process.env.NIMBUS_GMAIL,
        password: process.env.NIMBUS_PASS,
    };

    try {
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message || error);
        return null;
    }
};

const saveNimbusPost = async () => {
    const existingCourier = await B2Bcourier.findOne({ provider: 'NimbusPost' });
    if (!existingCourier) {
        const newB2B = new B2Bcourier({ provider: 'NimbusPost' });
        await newB2B.save();
        console.log('NimbusPost added to the B2Bcourier collection.');
    } else {
        console.log('NimbusPost already exists in the B2Bcourier collection.');
    }
};


module.exports={getToken,saveNimbusPost};