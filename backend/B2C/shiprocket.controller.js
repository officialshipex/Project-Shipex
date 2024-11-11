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
    // console.log(email)
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
// const createChannelOrder = async (req, res) => {
//     const orderData = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/orders/create`,
//             orderData,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

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
// const addInventory = async (req, res) => {
//     const inventoryData = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/products/addinventory`,
//             inventoryData,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 8. Map Unmapped Products
// const mapProducts = async (req, res) => {
//     const mapData = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/products/map`,
//             mapData,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 9. Import Orders in Bulk
// const importOrders = async (req, res) => {
//     const ordersData = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/orders/create/bulk`,
//             ordersData,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 10. Generate AWB for Shipment
// const generateAWB = async (req, res) => {
//     const { shipment_id, courier_id } = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/courier/awb/${shipment_id}`,
//             { courier_id },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 11. List of Couriers
const listCouriers = async (req, res) => {
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(`${BASE_URL}/courier/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 12. Check Courier Serviceability
const checkServiceability = async (req, res) => {
    const { pickup_pincode, delivery_pincode, cod } = req.query;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/serviceability/`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { pickup_pincode, delivery_pincode, cod }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 13. Request for Shipment Pickup
const requestShipmentPickup = async (req, res) => {
    const { shipment_id, pickup_location_id } = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/courier/generate/pickup`,
            { shipment_id, pickup_location_id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 14. Get All Orders
const getAllOrders = async (req, res) => {
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 15. Get Specific Order Details
// const getOrderDetails = async (req, res) => {
//     const { order_id } = req.params;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.get(
//             `${BASE_URL}/orders/show/${order_id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 16. Export Orders
const exportOrders = async (req, res) => {
    const { status, page, per_page } = req.query; // Optional query parameters
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/orders/export`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { status, page, per_page }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 17. Create a Return Order
const createReturnOrder = async (req, res) => {
    const { order_id, reason, items, pickup_location, pickup_address } = req.body;
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/orders/create/return`,
            { order_id, reason, items, pickup_location, pickup_address },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 18. Get All Return Orders
const getAllReturnOrders = async (req, res) => {
    const {email,password}=req.body
    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(`${BASE_URL}/orders/returns`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 19. Check Courier Serviceability
// const checkCourierServiceability = async (req, res) => {
//     const { pickup_pincode, delivery_pincode, cod } = req.query;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.get(
//             `${BASE_URL}/courier/serviceability`,
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: { pickup_pincode, delivery_pincode, cod }
//             }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 20. Generate AWB for Return Shipment
// const generateReturnAWB = async (req, res) => {
//     const { shipment_id, courier_id } = req.body;
//     const {email,password}=req.body
//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/courier/generate/return/awb`,
//             { shipment_id, courier_id },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 21. Get All Shipment Details
// const getAllShipments = async (req, res) => {
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.get(`${BASE_URL}/shipments`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 22. Get Details of Specific Shipment
// const getShipmentDetails = async (req, res) => {
//     const { shipment_id } = req.params;
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.get(
//             `${BASE_URL}/shipments/${shipment_id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 23. Cancel a Shipment
// const cancelShipment = async (req, res) => {
//     const { shipment_id } = req.body;
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/shipments/cancel`,
//             { shipment_id },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 24. Generate Manifest
const generateManifest = async (req, res) => {
    const { shipment_id } = req.body;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.post(
            `${BASE_URL}/manifests/generate`,
            { shipment_id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 25. Print Manifest
const printManifest = async (req, res) => {
    const { manifest_id } = req.body;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/manifests/${manifest_id}`,
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer' }
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 26. Generate Label
const generateLabel = async (req, res) => {
    const { shipment_id } = req.body;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/generate/label?shipment_id=${shipment_id}`,
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer' }
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 27. Generate Invoice
const generateInvoice = async (req, res) => {
    const { shipment_id } = req.body;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/generate/invoice?shipment_id=${shipment_id}`,
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer' }
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 28. Get All NDR Shipments
const getAllNDRShipments = async (req, res) => {
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(`${BASE_URL}/ndr/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 29. Get Specific NDR Shipment Details
const getNDRShipmentDetails = async (req, res) => {
    const { shipment_id } = req.params;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/ndr/${shipment_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 30. Action NDR (Non-Delivery Report) Shipment
// const actionNDRShipment = async (req, res) => {
//     const { shipment_id, action, comments } = req.body;
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/ndr/action`,
//             { shipment_id, action, comments },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 31. Get Tracking through AWB
const getTrackingByAWB = async (req, res) => {
    const { awb_code } = req.params;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/track/awb/${awb_code}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 32. Get Tracking Data for Multiple AWBs
// const getTrackingByMultipleAWBs = async (req, res) => {
//     const { awb_codes } = req.body; // Array of AWB codes
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/courier/track/awbs`,
//             { awb_codes },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 33. Get Tracking through Shipment ID
const getTrackingByShipmentID = async (req, res) => {
    const { shipment_id } = req.params;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/track/shipment/${shipment_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 34. Get Tracking Data through Order ID
const getTrackingByOrderID = async (req, res) => {
    const { order_id } = req.params;
    const {email,password}=req.body

    try {
        const token = await getAuthToken(email,password);
        const response = await axios.get(
            `${BASE_URL}/courier/track/order/${order_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};

// 35. Get All Pickup Locations
// const getAllPickupLocations = async (req, res) => {
//     const {email,password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.get(`${BASE_URL}/settings/company/pickup`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };

// 36 . Add a New Pickup Location
// const addNewPickupLocation = async (req, res) => {
//     const {
//         pickup_location,
//         name,
//         email,
//         phone,
//         address,
//         address_2,
//         city,
//         state,
//         country,
//         pin_code,
//         gstin
//     } = req.body;
//     const {password}=req.body

//     try {
//         const token = await getAuthToken(email,password);
//         const response = await axios.post(
//             `${BASE_URL}/settings/company/addpickup`,
//             {
//                 pickup_location,
//                 name,
//                 email,
//                 phone,
//                 address,
//                 address_2,
//                 city,
//                 state,
//                 country,
//                 pin_code,
//                 gstin
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.response?.data || error.message });
//     }
// };



module.exports = {
    createCustomOrder,
    createChannelOrder,
    updatePickupLocation,
    updateDeliveryAddress,
    updateOrder,
    cancelOrder,
    addInventory,
    mapProducts,
    importOrders,
    generateAWB,
    listCouriers,
    checkServiceability,
    requestShipmentPickup,
    getAllOrders,
    getOrderDetails,
    exportOrders,
    createReturnOrder,
    getAllReturnOrders,
    checkCourierServiceability,
    generateReturnAWB,
    getAllShipments,
    getShipmentDetails,
    cancelShipment,
    generateManifest,
    printManifest,
    generateLabel,
    generateInvoice,
    getAllNDRShipments,
    getNDRShipmentDetails,
    actionNDRShipment,
    getTrackingByAWB,
    getTrackingByMultipleAWBs,
    getTrackingByShipmentID,
    getTrackingByOrderID,
    getAllPickupLocations,
    addNewPickupLocation
};
