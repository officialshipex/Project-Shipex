const axios = require('axios');

const ordersDatabase = [
    { orderId: 1, platform: 'shiprocket', details: 'Order details for Shiprocket' },
    { orderId: 2, platform: 'nimbust', details: 'Order details for Nimbust' },
];


const getOrderDetails = (orderId) => {
    return ordersDatabase.find(order => order.orderId === orderId);
};

// Function to call Shiprocket NDR API
const callShiprocketNdrApi = async (orderDetails) => {
    try {
        const response = await axios.post('https://api.shiprocket.in/v1/external/ndr', orderDetails);
        return response.data;
    } catch (error) {
        throw new Error('Error calling Shiprocket NDR API');
    }
};

// Function to call Nimbust NDR API
const callNimbustNdrApi = async (orderDetails) => {
    try {
        const response = await axios.post('https://api.nimbust.com/v1/ndr', orderDetails);
        return response.data;
    } catch (error) {
        throw new Error('Error calling Nimbust NDR API');
    }
};

//Function to call Ecom Express NDR API
const callEcomExpressNdrApi = async (orderDetails) => {
    try {
        const response = await axios.post('https://api.nimbust.com/v1/ndr', orderDetails);
        return response.data;
    } catch (error) {
        throw new Error('Error calling Nimbust NDR API');
    }
};

module.exports = { getOrderDetails, callShiprocketNdrApi, callNimbustNdrApi, callEcomExpressNdrApi };
