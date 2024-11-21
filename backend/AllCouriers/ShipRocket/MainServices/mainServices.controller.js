const axios = require("axios");
const Order = require("../../../models/orderSchema.model");
const { getToken } = require("../Authorize/shiprocket.controller");

const BASE_URL = process.env.BASE_URL;

// 1. Create Custom Order
const createCustomOrder = async (req, res) => {
  const orderData = req.body;
  const { shipmentData } = req.body;
  const {
    order_number,
    payment_type,
    order_amount,
    package_weight,
    consignee,
    pickup,
    order_items,
  } = shipmentData;

  if (
    !order_number ||
    !payment_type ||
    !order_amount ||
    !package_weight ||
    !consignee ||
    !pickup ||
    !order_items ||
    order_items.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields or invalid data" });
  }
  try {
    const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      shipmentData,
      orderData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const newOrder = await Order.create(orderData);
    console.log(newOrder);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 2. Update Order
const updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const orderData = req.body;

  try {
    const token = await getToken();
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

// 3. Cancel an Order
const cancelOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const token = await getToken();
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

// 4. List of Couriers
const listCouriers = async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/courier/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 5. Check Courier Serviceability
const checkServiceability = async (req, res) => {
  const { pickup_pincode, delivery_pincode, cod } = req.query;

  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/courier/serviceability/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { pickup_pincode, delivery_pincode, cod },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 6. Request for Shipment Pickup
const requestShipmentPickup = async (req, res) => {
  const { shipment_id, pickup_location_id } = req.body;

  try {
    const token = await getToken();
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

// 7. Create a Return Order
const createReturnOrder = async (req, res) => {
  const { order_id, reason, items, pickup_location, pickup_address } = req.body;

  try {
    const token = await getToken();
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

// 8. Generate Manifest
const generateManifest = async (req, res) => {
  const { shipment_id } = req.body;

  try {
    const token = await getToken();
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

// 9. Generate Label
const generateLabel = async (req, res) => {
  const { shipment_id } = req.body;

  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/courier/generate/label?shipment_id=${shipment_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
      }
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 10. Generate Invoice
const generateInvoice = async (req, res) => {
  const { shipment_id } = req.body;

  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/courier/generate/invoice?shipment_id=${shipment_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
      }
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 11. Get All NDR Shipments
const getAllNDRShipments = async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/ndr/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 12. Get Tracking through AWB
const getTrackingByAWB = async (req, res) => {
  const { awb_code } = req.params;

  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/courier/track/awb/${awb_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

// 13. Get Tracking Data through Order ID
const getTrackingByOrderID = async (req, res) => {
  const { order_id } = req.params;
  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/courier/track/order/${order_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

module.exports = {
  createCustomOrder,

  updateOrder,
  cancelOrder,

  listCouriers,
  checkServiceability,
  requestShipmentPickup,

  createReturnOrder,

  generateManifest,

  generateLabel,
  generateInvoice,
  getAllNDRShipments,

  getTrackingByAWB,

  getTrackingByOrderID,
};
