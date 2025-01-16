const crypto = require('crypto');
const axios = require('axios');

async function phonePe(req, res) {
    try {
        const merchantTransactionId = 'M' + Date.now();
        const amount = req.query.amount;
        console.log("Amount : ", amount)
        console.log(req.query)
        const data = {
            merchantId: process.env.PHONE_PE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID' + `${Date.now()}`,
            name: "Kuldeep", // User Name
            amount: amount * 100, // Amount in paise
            redirectUrl: `http://localhost:3000/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: 7828153133,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.PHONE_PE_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };
        axios.request(options).then(function (response) {
            // console.log("Response : ",response)
            // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
            return res.json({
                redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
              });
        })
        .catch(function (error) {
                console.error(error.message);
                res.status(500).send({
                    message: error.message,
                    success: false
                })
            });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

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
      console.log(response);
      
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
        return_url: `http://localhost:5173/recharge`,
        notify_url: "http://localhost:5173/recharge",
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
    console.log("I AM BEING CALLED");
    console.log(req.params);
    // const { payment_method , payment_session_id } = req.body;
  
    // if (!payment_method || !payment_session_id ) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }
  
    // const paymentDetails = {
    //   payment_method:payment_method,
    //   payment_session_id:payment_session_id
    // }
  
    // try {
    //   const payment = await initiatePayment(paymentDetails);
  
    //   return res.status(200).json({
    //     data: payment
    //   });
    // } catch (error) {
    //   res.status(500).json({ error: "Payment Failed.." });
    // }
  }
  

module.exports = {
    phonePe,handlePaymentOrder,handlePaymentRequest
}