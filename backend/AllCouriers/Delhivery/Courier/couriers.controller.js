require('dotenv').config();
const axios = require('axios');
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;

const createOrder = async (req, res) => {
  const {
    orderId,
    waybill,
    pin,
    phone,
    address,
    paymentMode,
    pickupLocation,
    clientName,
    fragileShipment,
    sellerGstTin,
    hsnCode,
    invoiceReference,
    country = "India",
  } = req.body;

  if (!orderId || !pin || !phone || !address || !sellerGstTin || !hsnCode) {
    return res.status(400).json({
      error: "Missing mandatory fields: orderId, pin, phone, address, sellerGstTin, or hsnCode.",
    });
  }

  const url = `https://staging-express.delhivery.com/api/cmu/create.json`; // Change to production URL for live environment.

  const payload = {
    waybill: waybill || undefined, // Omit if not provided
    order: orderId,
    pin,
    phone,
    address,
    payment_mode: paymentMode,
    pickup_location: pickupLocation,
    client: clientName,
    fragile_shipment: fragileShipment === true ? true : undefined, // Omit if not applicable
    seller_gst_tin: sellerGstTin,
    hsn_code: hsnCode,
    invoice_reference: invoiceReference,
    country,
  };

  try {
    const response = await axios.post(url, {
      format: "json",
      data: JSON.stringify(payload),
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};


const checkPincodeServiceabilityDelhivery = async (pincode, order_type) => {
  console.log("I am in check pincode delivery");
  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  const url = "https://track.delhivery.com/c/api/pin-codes/json/?parameters";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
      params: {
        filter_codes: pincode,
      },
    });


    let result = response.data.delivery_codes;
    let finalResult=false;

    if (result.length > 0) {
      let data = result[0].postal_code;

      let { pre_paid, cash, pickup, remarks } = data;


      finalResult = (order_type === 'Cash on Delivery')
        ? (cash === 'Y' && pickup === 'Y' && remarks === "")
        : (pre_paid === 'Y' && pickup === 'Y' && remarks === "");

      
    }
    return finalResult;
  } catch (error) {
    
    console.error("Error fetching pincode serviceability:", error.message);

    return false;
  }
};

const trackShipment = async (req, res) => {
  const { waybill } = req.params;
  console.log(waybill)

  if (!waybill) {
    return res.status(400).json({ error: "Waybill number is required" });
  }

  // const url = `https://staging-express.delhivery.com/api/v1/packages/json/`;

  try {
    const response = await axios.get(`${url}/api/v1/packages/json/`, {
      params: { waybill },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error tracking shipment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipment tracking details",
      error: error.message,
    });
  }
};

const generateShippingLabel = async (req, res) => {
  const { waybill } = req.params;

  if (!waybill) {
    return res.status(400).json({ error: "Waybill number is required" });
  }

  // const url = `https://staging-express.delhivery.com/api/p/packing_slip`;

  try {
    const response = await axios.get(`${url}/api/p/packing_slip`, {
      params: {
        wbns: waybill,
        pdf: true,
      },
      responseType: 'arraybuffer',
    });


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="shipping-label-${waybill}.pdf"`);

    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Error generating shipping label:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate shipping label",
      error: error.message,
    });
  }
};

const createPickupRequest = async (req, res) => {
  const { pickupDetails } = req.body;
  console.log(pickupDetails)
  if (!pickupDetails) {
    return res.status(400).json({ error: "Pickup details are required" });
  }

  // const url = `https://staging-express.delhivery.com/fm/request/new/`;

  try {
    const response = await axios.post(`${url}/fm/request/new/`, pickupDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating pickup request:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create pickup request",
      error: error.message,
    });
  }
};


const createClientWarehouse = async (payload) => {

  const warehouseDetails={
      name:payload.warehouseName,                     
      address:`${payload.addressLine1} ${payload.addressLine2}`,
      pincode:parseInt(payload.pinCode),
      city:payload.city,                                                                      
      state:payload.state
  }

  if (!warehouseDetails) {
    return res.status(400).json({ error: "Warehouse details are required" });
  }

  const url = 'https://track.delhivery.com/api/backend/clientwarehouse/create/';

  try {
    const response = await axios.post(url, warehouseDetails, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; 
  }
};


const updateClientWarehouse = async (req, res) => {
  const { warehouseDetails } = req.body;

  if (!warehouseDetails) {
    return res.status(400).json({ error: "Warehouse details are required" });
  }

  const url = 'https://staging-express.delhivery.com/api/backend/clientwarehouse/edit/';

  try {
    const response = await axios.post(url, warehouseDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      },
    });

    return res.status(200).json({
      success: true,
      message: "Client warehouse updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating client warehouse:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update client warehouse",
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  checkPincodeServiceabilityDelhivery,
  trackShipment,
  generateShippingLabel,
  createPickupRequest,
  createClientWarehouse,
  updateClientWarehouse,
};