const axios = require('axios');
const Order = require('../models/orderSchema.model');

const BASE_URL = process.env.BASE_URL

async function getAuthToken(email,password) {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
    });
    return response.data.token;
}

// 1. Create Custom Order
const createCustomOrder = async (req, res) => {
    const orderData = req.body;
    // console.log(orderData)
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/orders/create/adhoc`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const newOrder = await Order.create(orderData);
        console.log(newOrder)
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 2. Create Channel-Specific Order
const createChannelOrder = async (req, res) => {
    const orderData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/orders/create`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 3. Change/Update Pickup Location
const updatePickupLocation = async (req, res) => {
    const { order_id } = req.params;
    const pickupData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.put(
            `${BASE_URL}/orders/address/pickup/${order_id}`,
            pickupData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 4. Update Customer Delivery Address
const updateDeliveryAddress = async (req, res) => {
    const { order_id } = req.params;
    const addressData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.put(
            `${BASE_URL}/orders/address/update/${order_id}`,
            addressData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 5. Update Order
const updateOrder = async (req, res) => {
    const { order_id } = req.params;
    const orderData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.put(
            `${BASE_URL}/orders/update/${order_id}`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 6. Cancel an Order
const cancelOrder = async (req, res) => {
    const { order_id } = req.params;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/orders/cancel`,
            { ids: [order_id] },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 7. Add Inventory for Ordered Product
const addInventory = async (req, res) => {
    const inventoryData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/products/addinventory`,
            inventoryData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 8. Map Unmapped Products
const mapProducts = async (req, res) => {
    const mapData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/products/map`,
            mapData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 9. Import Orders in Bulk
const importOrders = async (req, res) => {
    const ordersData = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/orders/create/bulk`,
            ordersData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

module.exports = {
    createCustomOrder,
    createChannelOrder,
    updatePickupLocation,
    updateDeliveryAddress,
    updateOrder,
    cancelOrder,
    addInventory,
    mapProducts,
    importOrders
};
