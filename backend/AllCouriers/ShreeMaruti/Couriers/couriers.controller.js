const axios = require('axios');
const { getToken } = require('../Authorize/shreeMaruti.controller');
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const { getUniqueId } = require("../../getUniqueId");

// Configuration (replace with actual values)
const BASE_URL = 'https://qaapis.delcaper.com'; // Replace with the actual base URL



const getCourierList = async (req, res) => {

    try {
        const hardCoreServices = [
            { name: "Shree Maruti service1" },
            { name: "Shree Maruti service2" },
            { name: " Shree Maruti service3" }
        ];

        if (hardCoreServices && hardCoreServices.length > 0) {
            const servicesData = hardCoreServices;
            const currCourier = await Courier.findOne({ provider: 'ShreeMaruti' }).populate('services');
            const prevServices = new Set(currCourier.services.map(service => service.courierProviderServiceName));

            const allServices = servicesData.map(element => ({
                service: element.name,
                isAdded: prevServices.has(element.name)
            }));

            return res.status(201).json(allServices);
        }

        res.status(400).json({ message: 'Failed to fetch services' });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch courier list",
            details: error.response?.data || error.message,
        });
    }
};


const addService = async (req, res) => {
    try {

        const currCourier = await Courier.findOne({ provider: 'ShreeMaruti' });

        const prevServices = new Set();
        const services = await Services.find({ '_id': { $in: currCourier.services } });

        services.forEach(service => {
            prevServices.add(service.courierProviderServiceName);
        });

        const name = req.body.service;


        if (!prevServices.has(name)) {
            const newService = new Services({
                courierProviderServiceId: getUniqueId(),
                courierProviderServiceName: name,
                courierProviderName: 'ShreeMaruti',

            });

            const S2 = await Courier.findOne({ provider: 'ShreeMaruti' });
            S2.services.push(newService._id);

            await newService.save();
            await S2.save();

            // console.log(`New service saved: ${name}`);

            return res.status(201).json({ message: `${name} has been successfully added` });
        }

        return res.status(400).json({ message: `${name} already exists` });
    } catch (error) {
        console.error(`Error adding service: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Create Order
const createOrder = async (req, res) => {
    const API_URL = "https://qaapis.delcaper.com/booking/order/";
    const token = await getToken();

    try {
        // Ensure the request body contains the required data
        if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ error: "Invalid or missing request body" });
        }

        // Make the API call
        const response = await axios.post(API_URL, req.body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Add the authentication token here
                async: false, // This makes the API wait for process completion
            },
        });

        // Log the successful response
        console.log("Order created successfully:", response.data);

        // Return the response to the client
        res.status(200).json(response.data);
    } catch (error) {
        // Log the error details
        console.error("Error creating order:", error.response?.data || error.message);

        // Send error response to the client
        res.status(500).json({
            error: "Order creation failed",
            details: error.response?.data || error.message,
        });
    }
};


// Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/booking/order/cancel/`, req.body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error cancelling order:', error.response?.data || error.message);
        res.status(500).json({ error: 'Order cancellation failed', details: error.response?.data || error.message });
    }
};

// Download Label and Invoice
const downloadLabelInvoice = async (req, res) => {
    const { awbNumber, cAwbNumber } = req.query; // Extracting query parameters

    if (!awbNumber || !cAwbNumber) {
        return res.status(400).json({ error: 'awbNumber and cAwbNumber are required' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/fulfillment/public/seller/order/download/label-invoice`, {
            params: { awbNumber, cAwbNumber }, // Passing query parameters
            headers: { Authorization: `Bearer ${token}` },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error downloading label/invoice:', error.response?.data || error.message);
        res.status(500).json({ error: 'Download failed', details: error.response?.data || error.message });
    }
};


// Create Manifest
const createManifest = async (req, res) => {
    console.log("hii");
    console.log(req.body);

    try {
        const response = await axios.post(`${BASE_URL}/fulfillment/public/seller/order/create-manifest`, req.body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating manifest:', error.response?.data || error.message);
        res.status(500).json({ error: 'Manifest creation failed', details: error.response?.data || error.message });
    }
};


// Track Order
const trackOrder = async (req, res) => {
    const { awbNumber, cAwbNumber } = req.query; // Expecting AWB Number or CAWB Number in query params

    if (!awbNumber && !cAwbNumber) {
        return res.status(400).json({ error: 'Either awbNumber or cAwbNumber is required' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/fulfillment/public/seller/order/order-tracking`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Ensure `getToken()` returns a valid token
            },
            params: { awbNumber, cAwbNumber }, // Query parameters
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error tracking order:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Tracking failed',
            details: error.response?.data || error.message,
        });
    }
};


// Serviceability
const checkServiceabilityShreeMaruti = async (payload) => {
    console.log("I am in chcekServiceability for shreeMaruti");
    const { fromPincode, toPincode, isCodOrder, deliveryMode } = payload;

    if (!fromPincode || !toPincode || isCodOrder === undefined || !deliveryMode) {
        return{ error: 'Missing required fields: fromPincode, toPincode, isCodOrder, and deliveryMode are mandatory.' }
    }


    try {
        const token = await getToken();
        console.log(token);
        const response = await axios.post(
            `${BASE_URL}/fulfillment/public/seller/order/check-ecomm-order-serviceability`,
            { fromPincode, toPincode, isCodOrder, deliveryMode },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(response?.data?.data?.serviceability){
           return true
        }
        else{
            return false;
        }
        
    } catch (error) {
        console.error('Error checking serviceability:', error.response?.data || error.message);
        return false;
    }
};


module.exports = {
    createOrder,
    cancelOrder,
    downloadLabelInvoice,
    createManifest,
    trackOrder,
    checkServiceabilityShreeMaruti,
    getCourierList,
    addService
};