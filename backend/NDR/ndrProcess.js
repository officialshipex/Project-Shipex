const { getOrderDetails, callShiprocketNdrApi, callNimbustNdrApi,callEcomExpressNdrApi } = require('../services/ndrService');


const ndrProcessController = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    const orderDetails = getOrderDetails(orderId);

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
        else {
            return res.status(400).json({ error: 'Unsupported platform' });
        }

        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { ndrProcessController };
