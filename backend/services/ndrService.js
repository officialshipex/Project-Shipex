const axios = require("axios");
const DELHIVERY_API_URL = process.env.DELHIVERY_URL;
const DEL_API_TOKEN = process.env.DEL_API_TOKEN;
const Order = require("../models/newOrder.model");
const moment = require("moment");

const ordersDatabase = [
  {
    orderId: 1,
    platform: "shiprocket",
    details: "Order details for Shiprocket",
  },
  { orderId: 2, platform: "nimbust", details: "Order details for Nimbust" },
];

const getOrderDetails = (orderId) => {
  return ordersDatabase.find((order) => order.orderId === orderId);
};

// Function to call Shiprocket NDR API
const callShiprocketNdrApi = async (orderDetails) => {
  try {
    const response = await axios.post(
      "https://api.shiprocket.in/v1/external/ndr",
      orderDetails
    );
    return response.data;
  } catch (error) {
    throw new Error("Error calling Shiprocket NDR API");
  }
};

// Function to call Nimbust NDR API
const callNimbustNdrApi = async (orderDetails) => {
  try {
    const response = await axios.post(
      "https://api.nimbust.com/v1/ndr",
      orderDetails
    );
    return response.data;
  } catch (error) {
    throw new Error("Error calling Nimbust NDR API");
  }
};

//Function to call Ecom Express NDR API
const callEcomExpressNdrApi = async (orderDetails) => {
  try {
    const response = await axios.post(
      "https://api.nimbust.com/v1/ndr",
      orderDetails
    );
    return response.data;
  } catch (error) {
    throw new Error("Error calling Nimbust NDR API");
  }
};

async function handleDelhiveryNdrAction(awb_number, action) {
  if (!awb_number || !action) {
    return {
      success: false,
      error: "Missing required parameters: waybill or act",
    };
  }

  // Step 1: Get current time and check if action is allowed
  const currentHour = moment().utcOffset("+05:30").hour();
  if (action === "RE-ATTEMPT" && currentHour < 21) {
    return {
      success: false,
      error: "Re-attempt can only be requested after 9 PM IST.",
    };
  }

  try {
    // Step 2: Fetch order details to check NSL code & attempt count
    const order = await Order.findOne({ awb_number });
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const attemptCount = order.ndrHistory?.length || 0;
    // console.log(attemptCount)
    if (attemptCount < 0 || attemptCount > 2) {
      return {
        success: false,
        error: "Re-attempt allowed only for attempt count 1 or 2.",
      };
    }

    // Step 3: Call Delhivery NDR API
    const payload = {
      data: [
        {
          waybill: String(awb_number).trim(), // Ensure it's a string
          act: String(action).trim().toUpperCase(), // Ensure action is uppercase
        },
      ],
    };

    console.log("payload", payload, DEL_API_TOKEN);
    const response = await axios.post(
      "https://track.delhivery.com/api/p/update",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${DEL_API_TOKEN}`,
        },
      }
    );

    console.log("Response Data:", response.data);
    const request_id = response.data?.request_id || null;
    if (!request_id) {
      return { success: false, error: "No request_id returned from API" };
    }

    // Step 4: Wait 5 seconds before fetching status
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 5: Fetch NDR status
    const ndrStatusResponse = await axios.get(
      `https://track.delhivery.com/api/cmu/get_bulk_upl/${request_id}?verbose=true`,
      {
        headers: { Authorization: `Token ${DEL_API_TOKEN}` },
      }
    );
console.log(ndrStatusResponse.data)
    if (!ndrStatusResponse.data) {
      return { success: false, error: "Failed to fetch NDR status" };
    }

    const { status, remark } = ndrStatusResponse.data;

    // Step 6: Ensure ndrHistory exists
    if (!Array.isArray(order.ndrHistory)) { 
      order.ndrHistory = [];
    }

    // Step 7: Save history entry
    const ndrHistoryEntry = {
      date: new Date(),
      action,
      remark: remark || "No remark provided",
      attempt: attemptCount + 1,
    };
    order.ndrStatus="Action_Requested";
    order.ndrHistory.push(ndrHistoryEntry);
    await order.save();

    return {
      success: true,
      request_id,
      ndr_status: ndrStatusResponse.data,
      updated_order: order,
    };
  } catch (error) {
    console.error("Error:", error.response);
    return {
      success: false,
      error: "Failed to request NDR action",
      details: error.response?.data || error.message,
    };
  }
}

async function getNdrStatus(request_id) {
  if (!request_id) {
    return { success: false, error: "Missing request_id" };
  }

  try {
    const response = await axios.get(
      `${DELHIVERY_API_URL}/api/cmu/get_bulk_upl/${request_id}?verbose=true`,
      {
        headers: {
          Authorization: `Token ${DEL_API_TOKEN}`,
        },
      }
    );

    console.log("NDR Status Response:", response.data);
    return { success: true, status_data: response.data };
  } catch (error) {
    console.error(
      "Error fetching NDR status:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: "Failed to fetch NDR status",
      details: error.response?.data || error.message,
    };
  }
}

module.exports = {
  getOrderDetails,
  callShiprocketNdrApi,
  callNimbustNdrApi,
  callEcomExpressNdrApi,
  handleDelhiveryNdrAction,
};
