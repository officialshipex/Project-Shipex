require('dotenv').config();
const axios = require('axios');
const Courier = require("../../../models/courierSecond");

const getAuthToken = async () => {

    const url = 'https://api.nimbuspost.com/v1/users/login';
    const payload = {
        email: 'VINCESINGAL+1581@GMAIL.COM',
        password: 'rnY4xE5bh4'
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

const saveNimbusPost=async()=>{
    const newCourier=new Courier({
        provider:'NimbusPost'
    });
    
    await newCourier.save();
}

module.exports={getAuthToken,saveNimbusPost};





