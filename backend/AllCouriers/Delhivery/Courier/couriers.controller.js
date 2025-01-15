require('dotenv').config();
const axios = require('axios');
const { fetchBulkWaybills } = require("../Authorize/saveCourierContoller");
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;
const Order = require("../../../models/orderSchema.model");
const crypto = require("crypto");


// HELPER FUNCTIONS
const getCurrentDateTime = () => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + 30);
  const pickup_date = now.toISOString().split("T")[0];
  const pickup_time = now.toTimeString().split(" ")[0];
  return { pickup_date, pickup_time };
};


const createOrder = async (req, res) => {
  const url = `https://track.delhivery.com/api/cmu/create.json`;

  const { selectedServiceDetails, id, wh } = req.body;
  const currentOrder = await Order.findById(id);



  const waybills = await fetchBulkWaybills(1);


  const payment_type =
    currentOrder.order_type === "Cash on Delivery" ? "COD" : "Pre-paid";

  const payloadData = {
    pickup_location: {
      name: wh.warehouseName || "Default Warehouse",
    },
    shipments: [{
      Waybill: waybills[0],
      country: "India",
      city: currentOrder.shipping_details.city,
      return_phone: wh.contactNo,
      pin: currentOrder.shipping_details.pinCode,
      state: currentOrder.shipping_details.state,
      order: currentOrder.order_id,
      add: `${currentOrder.shipping_details.address} ${currentOrder.shipping_details.address2}`,
      payment_mode: payment_type,
      quantity: currentOrder.Product_details.length.toString(),
      return_add: `${wh.addressLine1}`,
      phone: currentOrder.shipping_details.phone,
      total_amount: currentOrder.sub_total,
      name: `${currentOrder.shipping_details.firstName} ${currentOrder.shipping_details.lastName}`,
      return_country: "India",
      return_city: wh.city,
      return_state: wh.state,
      return_pin: wh.pinCode,
      shipment_height: currentOrder.shipping_cost.dimensions.height,
      shipment_width: currentOrder.shipping_cost.dimensions.width,
      shipment_length: currentOrder.shipping_cost.dimensions.heightlength,
      cod_amount: payment_type === "COD" ? `${currentOrder.sub_total}` : "0",
    }],
  };



  const payload = `format=json&data=${encodeURIComponent(JSON.stringify(payloadData))}`;


  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });


    if (response.data.success) {
      const result = response.data.packages[0];
      currentOrder.status = 'Booked';
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.waybill;
      currentOrder.shipment_id = `${result.refnum}`;
      currentOrder.service_details = selectedServiceDetails._id;
      currentOrder.warehouse = wh._id;
      currentOrder.tracking=[];
      currentOrder.tracking.push({
        stage:'Order Booked'
       });
      let savedOrder = await currentOrder.save();

      return res.status(201).json({ message: "Shipment Created Succesfully" });
    } else {
      return res.status(400).json({ error: 'Error creating shipment', details: response.data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};



const checkPincodeServiceabilityDelhivery = async (pincode, order_type) => {

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
    let finalResult = false;

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

const trackShipmentDelhivery= async (waybill) => {

  if (!waybill) {
    return res.status(400).json({ error: "Waybill number is required" });
  }


  try {
    const response = await axios.get(`${url}/api/v1/packages/json/waybill=${waybill}&token=${API_TOKEN}`);
    console.log(response);
    if(response?.data?.success){
      return({
        succes:true,
        data:response.data
      })
    }
    else{
      return({
        success:false,
        data:"Error in tracking"
      });
    }

  } catch (error) {
    console.error("Error tracking shipment:", error.message);
    return({
      success:false,
      data:"Error in tracking"
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

const createPickupRequest = async (warehouse_name, awb) => {

  const result = getCurrentDateTime();

  const pickupDetails = {
    pickup_time: result.pickup_time,
    pickup_date: result.pickup_date,
    pickup_location: warehouse_name,
    expected_package_count: 1,
    waybill: `${awb}`,
  };

  if (!pickupDetails.pickup_time || !pickupDetails.pickup_date || !pickupDetails.pickup_location || !pickupDetails.waybill) {
    return ({ error: "All pickup details are required" });
  }

  const url = `https://track.delhivery.com/fm/request/new/`;

  try {
    const response = await axios.post(url, pickupDetails, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    if (response?.data?.success) {
      return ({
        success: true,
        message: "Pickup request created successfully",
        data: response.data,
        pickupDate: pickup_date
      });
    }
    else {
      return ({
        success: false,
        message: "Failed to create pickup request",
      });
    }
  } catch (error) {

    return ({
      success: false,
      message: "Failed to create pickup request",
      error: error.message,
    });
  }
};


const createClientWarehouse = async (payload) => {

  const warehouseDetails = {
    name: payload.warehouseName,
    phone: payload.contactNo,
    address: `${payload.addressLine1} ${payload.addressLine2}`,
    pin: payload.pinCode,
    city: payload.city,
    state: payload.state,
    return_address: `${payload.addressLine1} ${payload.addressLine2}`,
    return_pin: payload.pinCode
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

const cancelOrderDelhivery = async (awb_number) => {
  console.log("I am in cancel order");
  const payload = {
    waybill: `${awb_number}`,
    cancellation: true
  }
  const url = 'https://track.delhivery.com/api/p/edit';

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    if (response?.data?.status) {
      return { data: response.data, code: 201 };
    }
    else {
      return {
        error: 'Error in shipment cancellation',
        details: response.data,
        code: 400,
      };
    }
  }
  catch (error) {
    return {
      error: 'Internal Server Error',
      message: error.message,
      code: 500,
    };
  }

}


module.exports = {
  createOrder,
  checkPincodeServiceabilityDelhivery,
  trackShipmentDelhivery,
  generateShippingLabel,
  createPickupRequest,
  createClientWarehouse,
  updateClientWarehouse,
  cancelOrderDelhivery
};
