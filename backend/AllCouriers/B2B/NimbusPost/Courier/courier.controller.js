require('dotenv').config({ path: "../../../../.env" });
const { getToken } = require("../Authorize/authorize.controller");
const axios = require('axios');
const {saveNimbusPost}=require("../Authorize/authorize.controller");
const B2BCourierService=require("../../../../models/B2BcourierService");
const B2Bcourier=require("../../../../models/B2Bcourier");

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







async function getRateAndServiceability(payload) {
    const url = 'https://ship.nimbuspost.com/api/courier/b2b_serviceability';

    try {
        const token = await getToken();

        if (!token?.data) {
            throw new Error('Failed to fetch token.');
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}` // Use fetched token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching rate and serviceability:', error.response?.data || error.message);
        throw error;
    }
}

const rateAndServiceability = async () => {
    const testPayload = {
        origin: "122001",
        destination: "400001",
        payment_type: "prepaid",
        details: [
            {
                qty: 2,
                weight: 4,
                length: 1,
                breadth: 1,
                height: 1
            }
        ],
        order_value: "2"
    };

    try {
        await saveNimbusPost();

       
        const nimbusPost = await B2Bcourier.findOne({ provider: "NimbusPost" });
        if (!nimbusPost) {
            throw new Error("NimbusPost provider not found in the database.");
        }

        
        const result = await getRateAndServiceability(testPayload);

        const services = result.data || [];
        if (services.length === 0) {
            console.log("No services available for the provided parameters.");
            return;
        }

        
        const existingServices = await B2BCourierService.find({
            courierProviderServiceName: { $in: services.map(s => s.name) }
        });

        const existingServiceNames = new Set(existingServices.map(s => s.courierProviderServiceName));

        
        for (let service of services) {
            if (!existingServiceNames.has(service.name)) {
                let newService=new B2BCourierService({
                    courierProviderServiceId: nimbusPost._id,
                    courierProviderServiceName: service.name
                });
                await newService.save();
                nimbusPost.services.push(newService._id);
                await nimbusPost.save();
            }
        }

        console.log("Services updated successfully.");
    } catch (error) {
        console.error('Operation failed:', error.message);
    }
};




module.exports = { createOrder, trackShipment, manifestOrder,cancelManifestOrder,rateAndServiceability};


