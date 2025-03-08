const axios = require('axios');
const DELHIVERY_API_URL=process.env.DELHIVERY_URL
const DEL_API_TOKEN=process.env.DEL_API_TOKEN
const Order=require("../models/newOrder.model")

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



async function handleDelhiveryNdrAction(awb_number, action) {
    console.log("AWB Number:", awb_number, "Action:", action);

    if (!awb_number || !action) {
        return { success: false, error: "Missing required parameters: waybill or act" };
    }

    const payload = {
        waybill: awb_number,
        act: action
    };

    try {
        // Step 1: Call Delhivery NDR Action API
        const response = await axios.post(`${DELHIVERY_API_URL}/api/p/update`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${DEL_API_TOKEN}`
            }
        });

        console.log("Response Data:", response.data);

        const request_id = response.data?.request_id || null;
        if (!request_id) {
            return { success: false, error: "No request_id returned from API" };
        }

        // Step 2: Wait 5 seconds before fetching status (optional)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Step 3: Fetch NDR status
        const ndrStatusResponse = await getNdrStatus(request_id);
        if (!ndrStatusResponse || !ndrStatusResponse.success) {
            return { success: false, error: "Failed to fetch NDR status" };
        }

        const { status, remark } = ndrStatusResponse.data;

        // Step 4: Find and update Order
        const order = await Order.findOne({ awb_number });
        if (!order) {
            return { success: false, error: "Order not found" };
        }

        // Ensure ndrHistory exists
        if (!Array.isArray(order.ndrHistory)) {
            order.ndrHistory = [];
        }

        // Determine the correct attempt number
        let attempt = 1; // Default to 1 if no previous history
        if (order.ndrHistory.length > 0) {
            attempt = order.ndrHistory[order.ndrHistory.length - 1].attempt + 1;
            if (attempt > 3) {
                attempt = 3; // Cap attempt at 3
            }
        }

        // Create NDR history entry
        const ndrHistoryEntry = {
            date: new Date(), // Current timestamp
            action,
            remark: remark || "No remark provided",
            attempt
        };

        // Push new entry to the history array
        order.ndrHistory.push(ndrHistoryEntry);

        // Save updated order
        await order.save();

        return {
            success: true,
            request_id,
            ndr_status: ndrStatusResponse,
            updated_order: order
        };
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);

        return {
            success: false,
            error: "Failed to request NDR action",
            details: error.response?.data || error.message
        };
    }
}




async function getNdrStatus(request_id) {
    if (!request_id) {
        return { success: false, error: "Missing request_id" };
    }

    try {
        const response = await axios.get(`${DELHIVERY_API_URL}/api/cmu/get_bulk_upl/${request_id}?verbose=true`, {
            headers: {
                "Authorization": `Token ${DEL_API_TOKEN}`
            }
        });

        console.log("NDR Status Response:", response.data);
        return { success: true, status_data: response.data };
    } catch (error) {
        console.error("Error fetching NDR status:", error.response?.data || error.message);
        return { success: false, error: "Failed to fetch NDR status", details: error.response?.data || error.message };
    }
}





module.exports = { getOrderDetails, callShiprocketNdrApi, callNimbustNdrApi, callEcomExpressNdrApi,handleDelhiveryNdrAction };
