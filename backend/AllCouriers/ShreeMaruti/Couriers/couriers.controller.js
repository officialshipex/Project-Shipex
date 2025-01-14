require('dotenv').config();
const axios = require('axios');
const { getToken } = require('../Authorize/shreeMaruti.controller');
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const Order = require("../../../models/orderSchema.model");
const { getUniqueId } = require("../../getUniqueId");

// Configuration (replace with actual values)
const BASE_URL = process.env.SHREEMA_URL; // Replace with the actual base URL



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
    const API_URL = `${BASE_URL}/fulfillment/public/seller/order/ecomm/push-order`;
    const token = await getToken();


    try {
        const { selectedServiceDetails, id, wh } = req.body;
        const currentOrder = await Order.findById(id);

        const order_items = new Array(currentOrder.Product_details.length);
        currentOrder.Product_details.map((item, index) => {
            order_items[index] = {
                name: item.product,
                quantity: parseInt(item.quantity),
                price: item.amount * item.quantity,
                unitPrice: parseInt(item.amount),
                weight: parseInt(currentOrder.shipping_cost.weight / currentOrder.Product_details.length)
                // sku: item.sku||null
            };
        });


        let payment_type = currentOrder.order_type === "Cash on Delivery" ? "COD" : "ONLINE";
        let payment_status = currentOrder.order_type === "Cash on Delivery" ? "PENDING" : "PAID"

        const payload = {
            orderId: currentOrder.order_id,
            orderSubtype: "FORWARD",
            currency: "INR",
            amount: currentOrder.sub_total,
            weight: parseInt(currentOrder.shipping_cost.weight),
            lineItems: order_items,
            paymentType: payment_type,
            paymentStatus: payment_status,
            length: parseInt(currentOrder.shipping_cost.dimensions.length),
            height: parseInt(currentOrder.shipping_cost.dimensions.height),
            width: parseInt(currentOrder.shipping_cost.dimensions.width),
            billingAddress: {
                name: `${currentOrder.Biling_details.firstName} ${currentOrder.Biling_details.lastName}`,
                phone: currentOrder.Biling_details.phone.toString(),
                address1: currentOrder.Biling_details.address,
                address2: currentOrder.Biling_details.address2,
                city: currentOrder.Biling_details.city,
                state: currentOrder.Biling_details.state,
                country: "India",
                zip: `${currentOrder.Biling_details.pinCode}`,
            },
            shippingAddress: {
                name: `${currentOrder.shipping_details.firstName} ${currentOrder.shipping_details.lastName}`,
                phone: currentOrder.shipping_details.phone.toString(),
                address1: currentOrder.shipping_details.address,
                address2: currentOrder.shipping_details.address2,
                city: currentOrder.shipping_details.city,
                state: currentOrder.shipping_details.state,
                country: "India",
                zip: `${currentOrder.shipping_details.pinCode}`,
            },
            pickupAddress: {
                name: wh.contactName,
                phone: wh.contactNo.toString(),
                address1: wh.addressLine1,
                address2: wh.addressLine2,
                city: wh.city,
                state: wh.state,
                country: "India",
                zip: wh.pinCode,
            },
            returnAddress: {
                name: wh.contactName,
                phone: wh.contactNo.toString(),
                address1: wh.addressLine1,
                address2: wh.addressLine2,
                city: wh.city,
                state: wh.state,
                country: "India",
                zip: wh.pinCode,
            }

        }



        const response = await axios.post(API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });


        if (response.data.status == 200) {
            const result = response.data.data;
            currentOrder.status = 'Booked';
            currentOrder.cancelledAtStage = null;
            currentOrder.awb_number = result.awb_number;
            currentOrder.shipment_id = `${result.shipperOrderId}`;
            currentOrder.service_details = selectedServiceDetails._id;
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
        console.log(error.response);
        console.error('Error in creating shipment:', error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


// Cancel Order
const cancelOrderShreeMaruti= async (order_Id) => {
    const payload = {
        orderId: `${order_Id}`,
        cancelReason: "Cancel Test"
    }
    try {
        const token = await getToken();
        const response = await axios.put(`${BASE_URL}/booking/order/cancel/`, payload, {
            headers: {
                'Content-Type': 'application / json',

                Authorization: `Bearer ${token}`
            },
        });

        if(response.data.status==200){
          return{
            success:true,
            data:response.data
          }
        }
        else {
            return {
                error: 'Error in shipment cancellation',
                details: response.data,
                code: 400,
            };
        }

    } catch (error) {
        return {
            error: 'Internal Server Error',
            message: error.message,
            code: 500,
        };
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
const trackOrderShreeMaruti= async (awbNumber) => {
    
    if (!awbNumber) {
        return res.status(400).json({ error: 'Either awbNumber or cAwbNumber is required' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/fulfillment/public/seller/order/order-tracking`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            params: { awbNumber}, 
        });

        if(response.data.status==200){
            return({
             success:true,   
             data:response.data.data.orderStatus
            });
        }
        else{
            return({
                success:false,
                data:"Error in tracking"
            })
        }
    } catch (error) {
        console.error('Error tracking order:', error.response?.data || error.message);
        console.log(error);

        return({
            success:false,
            data:"Error in tracking"
        })
      
    }
};


// Serviceability
const checkServiceabilityShreeMaruti = async (payload) => {
    const { fromPincode, toPincode, isCodOrder, deliveryMode } = payload;

    if (!fromPincode || !toPincode || isCodOrder === undefined || !deliveryMode) {
        return { error: 'Missing required fields: fromPincode, toPincode, isCodOrder, and deliveryMode are mandatory.' }
    }



    try {
        const token = await getToken();
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
        if (response?.data?.data?.serviceability) {
            return true
        }
        else {
            return false;
        }

    } catch (error) {
        console.error('Error checking serviceability:', error.response?.data || error.message);
        return false;
    }
};


module.exports = {
    createOrder,
    cancelOrderShreeMaruti,
    downloadLabelInvoice,
    createManifest,
    trackOrderShreeMaruti,
    checkServiceabilityShreeMaruti,
    getCourierList,
    addService
};