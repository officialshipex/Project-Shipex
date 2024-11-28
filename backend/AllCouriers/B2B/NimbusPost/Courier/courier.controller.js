require('dotenv').config({ path: "../../../../.env" });
const { getToken } = require("../Authorize/authorize.controller");
const axios = require('axios');

const createOrder= async (req, res) => {
    const url = 'https://ship.nimbuspost.com/api/shipmentcargo/create';
    const token = await getToken();

    if (!token || !token.data) {
        console.error("Failed to fetch token.");
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
    }

    const { payload } = req.body;

    const requiredFields = [
        "order_id", "payment_method", "consignee_name", "consignee_company_name",
        "consignee_phone", "consignee_address", "consignee_pincode", "consignee_city",
        "consignee_state", "no_of_invoices", "no_of_boxes", "courier_id", "request_auto_pickup",
        "invoice", "pickup", "products"
    ];

    const missingFields = requiredFields.filter(field => !(field in payload));
    if (missingFields.length > 0) {
        console.error("Missing mandatory fields:", missingFields);
        return res.status(400).json({
            success: false,
            error: "Missing mandatory fields",
            missingFields
        });
    }

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Order Created Successfully:", response.data);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: response.data.data
        });
    } catch (error) {
        console.error("Error Creating Order:", error.response?.data || error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.response?.data || error.message,
        });
    }
};




const trackShipment = async (req, res) => {
    const shipmentId = req.params.shipmentId;
    const url = `https://ship.nimbuspost.com/api/shipmentcargo/track/${shipmentId}`;
    const token = await getToken();

    if (!token.data) {
        console.error("Failed to fetch token.");
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
    }
    if (!shipmentId) {
        return res.status(400).json({ success: false, error: "Shipment ID is required" });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                "Content-Type": "application/json",
            },
        });

        res.status(200).json({
            success: true,
            message: "Shipment tracked successfully",
            data: response.data.data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to track shipment",
            error: error.response?.data || error.message,
        });
    }
};



const manifestOrder = async (req, res) => {
    const url = 'https://ship.nimbuspost.com/api/shipmentcargo/pickup';
    const token = await getToken();

    // Validate token
    if (!token.data) {
        console.error("Failed to fetch token.");
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
    }

    const { awbs } = req.body;

    if (!awbs || !Array.isArray(awbs) || awbs.length === 0) {
        return res.status(400).json({
            success: false,
            error: "AWBs array is required and cannot be empty."
        });
    }

    const payload = { awbs };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                "Content-Type": "application/json",
            },
        });

        res.status(201).json({
            success: true,
            message: "Manifest order successfully created",
            data: response.data.data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create manifest order",
            error: error.response?.data || error.message,
        });
    }
};


const cancelManifestOrder = async (req, res) => {
    const url = 'https://ship.nimbuspost.com/api/shipmentcargo/Cancel';
    const token = await getToken();

    if (!token.data) {
        console.error("Failed to fetch token.");
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
    }

    const { awb } = req.body;

    if (!awb || typeof awb !== "string" || awb.trim() === "") {
        return res.status(400).json({
            success: false,
            error: "AWB is required and must be a non-empty string.",
        });
    }

    const payload = { awb };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                "Content-Type": "application/json",
            },
        });

        res.status(200).json({
            success: true,
            message: "Manifest order successfully canceled",
            data: response.data.data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel manifest order",
            error: error.response?.data || error.message,
        });
    }
};


const rateAndServiceability = async (req, res) => {
    const url = 'https://ship.nimbuspost.com/api/courier/b2b_serviceability';
    const token = await getToken();

    if (!token.data) {
        console.error("Failed to fetch token.");
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
    }

    const { origin, destination, payment_type, details, order_value } = req.body;

    
    if (!origin || typeof origin !== 'string' || origin.length !== 6) {
        return res.status(400).json({ success: false, error: "Invalid or missing origin pin code." });
    }

    if (!destination || typeof destination !== 'string' || destination.length !== 6) {
        return res.status(400).json({ success: false, error: "Invalid or missing destination pin code." });
    }

    if (!payment_type || (payment_type !== "prepaid" && payment_type !== "cod")) {
        return res.status(400).json({ success: false, error: "Payment type must be 'prepaid' or 'cod'." });
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
        return res.status(400).json({ success: false, error: "Details must be a non-empty array." });
    }

    for (const item of details) {
        if (
            !item.qty || !item.weight || !item.length || !item.breadth || !item.height ||
            typeof item.qty !== 'number' || typeof item.weight !== 'number' ||
            typeof item.length !== 'number' || typeof item.breadth !== 'number' ||
            typeof item.height !== 'number'
        ) {
            return res.status(400).json({ success: false, error: "Invalid or missing fields in details array." });
        }
    }

    if (!order_value || isNaN(order_value)) {
        return res.status(400).json({ success: false, error: "Invalid or missing order value." });
    }

    const payload = { origin, destination, payment_type, details, order_value };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token.data}`, 
                "Content-Type": "application/json", 
            },
        });

        
        res.status(200).json({
            success: true,
            message: "Rate and serviceability details fetched successfully",
            data: response.data.data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rate and serviceability details",
            error: error.response?.data || error.message,
        });
    }
};





module.exports = { createOrder, trackShipment, manifestOrder,cancelManifestOrder,rateAndServiceability};

