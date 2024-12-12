const axios = require('axios');
const shipCargoOrder = require('../models/shipCargoOrder.model.js');
const { getToken } = require('../Authorize/shiprocketCargo.contorller');

const SHIPCARGO_BASE_URL = process.env.SHIPCARGO_BASE_URL;

// 1. Create Custom Cargo Order..
const createCustomCargoOrder =  async(req,res) => {       
    try {
            const orderData = req.body;
            const token = await getToken();
            console.log("token:",token);
            
            const response = await axios.post(
                `${SHIPCARGO_BASE_URL}external/order_creation/`,
                orderData,
                { headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    } }
                );
          // Extract necessary data from the response
        const responseData = response.data;
 
        // Save the response to MongoDB
        const savedOrder = await shipCargoOrder.create({
            orderId: responseData.order_id,
            fromWarehouseId: responseData.from_warehouse_id,
            toWarehouseId: responseData.to_warehouse_id,
            mode: responseData.mode,
            modeId: responseData.mode_id,
            deliveryPartnerName: responseData.delivery_partner_name,
            deliveryPartnerId: responseData.delivery_partner_id,
            transportarId: responseData.transportar_id
        });
                
        return res.json({
            success : true,
            data : response.data
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: error.response?.data || error.message });
    }   
}

// 2. Shipment Creation...
const createShipment = async(req,res) => {
    try {
        const shipmentData = req.body;
        
        const token = await getToken();
        console.log("token:",token);
        
        const response = await axios.post(
            `${SHIPCARGO_BASE_URL}order_shipment_association/`,
            shipmentData,
            { headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                } }
            );

        return res.json({
            success : true,
            data : response.data
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: error.response?.data || error.message });
    }   
}

// 3. Get shipment details..
const getShipmentDetails = async(req,res) => {
    try {
        const responseID = req.body.id;
        console.log("body:",responseID);
        const token = await getToken();
        console.log("token:",token);
        
        const response = await axios.get(
            `${SHIPCARGO_BASE_URL}external/get_shipment/${responseID}/`,
            { headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } }
        );

        console.log("res:",response.data);
        return res.json({
            success : true,
            data : response.data
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: error.response?.data || error.message });
    }   
}
  
// 4. Get order details..
const getOrderDetails = async(req,res) => {
    try {
        const orderID = req.body.order_id;
        console.log("body:",orderID);
        const token = await getToken();
        console.log("token:",token);
        
        const response = await axios.get(
            `${SHIPCARGO_BASE_URL}external/get_order/${orderID}/`,
            { headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } }
        );

        console.log("res:",response.data);
        return res.json({
            success : true,
            data : response.data
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: error.response?.data || error.message });
    }   
}

// 5. Tracking orders by AWB Number...
const getTrackingBywaybillno = async (req, res) => {
    try {
    const  waybill_no = req.body.waybill_no;
    console.log("awb:",waybill_no);

      const token = await getToken();
      const response = await axios.get(
        `${SHIPCARGO_BASE_URL}shipment/track/${waybill_no}/`,
        { 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         }
      );
      console.log("response:",response);
      
      return res.json({
        success : true,
        data : response.data
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: error.response?.data || error.message });
    }   
  };
  

module.exports = {
    createCustomCargoOrder,
    createShipment,
    getShipmentDetails,
    getOrderDetails,
    getTrackingBywaybillno
    
}