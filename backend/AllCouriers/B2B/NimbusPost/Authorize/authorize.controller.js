require('dotenv').config({ path: "../../../../.env" }); 
const axios = require('axios');

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

module.exports={getToken};