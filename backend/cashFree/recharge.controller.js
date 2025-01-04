require("dotenv").config();
const axios = require('axios');

const createPaymentOrder = async (orderDetails) => {
  
  const url = `${process.env.CASHFREE_BASE_URL}/orders`;  
  const headers = {
    "accept":"application/json",
    "Content-Type": "application/json",
    "x-api-version":"2023-08-01",
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
  };

  try {
    const response = await axios.post(url, orderDetails, { headers });
    
    return response.data;
  } catch (error) {
    console.error("Cashfree API Error:", error.response.data);
    throw error.response.data;
  }
};


const initiatePayment = async(paymentDetails) => {

  const url = `${process.env.CASHFREE_BASE_URL}/orders/sessions`;  
  const headers = {
    "accept":"application/json",
    "Content-Type": "application/json",
    "x-api-version":"2023-08-01",
  };

  try {
    const response = await axios.post(url, paymentDetails, { headers });
    
    return response.data;
  } catch (error) {
    console.error("Cashfree API Error:", error.response.data);
    throw error.response.data;
  }
}


const handlePaymentOrder = async (req, res) => {
  
  const { userId, amount, name, email, phone } = req.body;
  console.log("body",req.body);
  
  if (!userId || !amount || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const orderId = `order_${Date.now()}`; // Unique order ID
  const orderDetails = {
    order_id: orderId,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: userId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
    },
    order_meta: {
      return_url: `http://localhost:5000/v1/payment/callback?order_id=${orderId}`,
      notify_url: "http://localhost:5000/v1/payment/notify",
    },
    order_note: `Wallet recharge for user ${userId}`,
  };
  

  try {
    const order = await createPaymentOrder(orderDetails);
    
    return res.status(201).json({
        success:true,
        massege:"Order Created Successfully.",
        data:order
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

const handlePaymentRequest = async(req,res) => {
  const { payment_method , payment_session_id } = req.body;

  if (!payment_method || !payment_session_id ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const paymentDetails = {
    payment_method:payment_method,
    payment_session_id:payment_session_id
  }

  try {
    const payment = await initiatePayment(paymentDetails);

    return res.status(200).json({
      data: payment
    });
  } catch (error) {
    res.status(500).json({ error: "Payment Failed.." });
  }
}
module.exports = { handlePaymentOrder,handlePaymentRequest }
