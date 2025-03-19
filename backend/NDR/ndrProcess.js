const { getOrderDetails, callShiprocketNdrApi, callNimbustNdrApi,callEcomExpressNdrApi,handleDelhiveryNdrAction } = require('../services/ndrService');
const Order=require("../models/newOrder.model")

const ndrProcessController = async (req, res) => {

const {awb_number,action}=req.body
    const orderDetails=await Order.findOne({awb_number:awb_number})
// console.log(orderDetails)
    // const orderDetails = getOrderDetails(orderId);

    if (!orderDetails) {
        return res.status(404).json({ error: 'Order not found' });
    }

    try {
        let response;
        if (orderDetails.platform === 'shiprocket') {
            response = await callShiprocketNdrApi(orderDetails);
        } else if (orderDetails.platform === 'nimbust') {
            response = await callNimbustNdrApi(orderDetails);
        } else if(orderDetails.platform==='ecomexpress'){
            response = await callEcomExpressNdrApi(orderDetails)
        }
        else if(orderDetails.provider==='Delhivery'){
            response=await handleDelhiveryNdrAction(awb_number,action)
        }
        else {
            return res.status(400).json({ error: 'Unsupported platform' });
        }
console.log("resererer",response)
        res.json({ success: response.success, data: response.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { ndrProcessController };
