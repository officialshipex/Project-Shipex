if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const crypto = require("crypto");
const axios = require("axios");
const Wallet = require("../models/wallet");
const Razorpay = require("razorpay");
const FRONTEND_URL = process.env.FRONTEND_URL;
const URL_CASHFREE = "https://api.cashfree.com/pg"
// process.env.CASHFREE_PRODUCTION_BASE_URL;

async function phonePe(req, res) {
  // console.log('hiii')
  try {
    // console.log(req.body)
    const { amount, name, phone } = req.body; // Extract data from frontend
    const merchantTransactionId = `TXN${Date.now()}`;
    // console.log(merchantTransactionId)
    // console.log("Received Data:", { amount, name, phone });

    const data = {
      merchantId: process.env.PHONE_PE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `MUID${Date.now()}`,
      name: name || "User", // Use provided name or default
      amount: amount * 100, // Convert amount to paise
      redirectUrl: `https://ship.carryship.in/status/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: phone , // Use provided phone number or default
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    console.log(data)
    // const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(JSON.stringify(data),"utf-8").toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + process.env.PHONE_PE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: { request: payloadMain },
    };

    axios.request(options)
      .then((response) => {
        return res.json({ redirectUrl: response.data.data.instrumentResponse.redirectInfo.url });
      })
      .catch((error) => {
        console.error(error.message);
        res.status(500).send({ message: error.message, success: false });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message, success: false });
  }
}

const createPaymentOrder = async (orderDetails) => {
  let cashfreeId = process.env.CASHFREE_PRODUCTION_CLIENT_ID;
  let cashfreeSecret = process.env.CASHFREE_PRODUCTION_CLIENT_SECRET;

  console.log("Cashfree ID:", cashfreeId);
  console.log("Cashfree Secret:", cashfreeSecret ? "****" : "NOT FOUND"); // Mask secret for security

  if (!cashfreeId || !cashfreeSecret) {
    throw new Error("Cashfree credentials are missing. Check .env file.");
  }

  const url = `${URL_CASHFREE}/orders`;
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-version": "2023-08-01",
    "x-client-id": cashfreeId,
    "x-client-secret": cashfreeSecret,
  };

  try {
    const response = await axios.post(url, orderDetails, { headers });
    // console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Cashfree API Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to create payment order");
  }
};


const initiatePayment = async (paymentDetails) => {
  const url = `${URL_CASHFREE}/orders/sessions`;
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-version": "2023-08-01",
  };

  try {
    const response = await axios.post(url, paymentDetails, { headers });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Cashfree API Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Failed to initiate payment");
  }
};

const handlePaymentOrder = async (req, res) => {
  const { userId, amount, name, email, phone } = req.body;

  if (!userId || !amount || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // console.log(req.body)
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
      return_url: `${FRONTEND_URL}/recharge`,
      notify_url: `${FRONTEND_URL}/recharge`,
    },
    order_note: `Wallet recharge for user ${userId}`,
  };
  // console.log(orderDetails)

  try {
    const order = await createPaymentOrder(orderDetails);
    // console.log("Order Response: ", order);

    if (order?.payment_session_id) {
      console.log(order.payment_session_id);
    } else {
      console.warn("No payment session ID in response");
    }

    return res.status(201).json({
      success: true,
      message: "Order Created Successfully.",
      data: order,
    });
  } catch (error) {
    console.log("Error creating order:", error.message);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
};

const handlePaymentRequest = (req, res) => {
  const { orderId, walletId } = req.params;

  console.log(orderId);
  axios
    .get(`${URL_CASHFREE}/orders/${orderId}`, {
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_PRODUCTION_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_PRODUCTION_CLIENT_SECRET,
      },
    })
    .then((response) => {
      // console.log(response);
      if (response?.data?.order_status === "PAID") {
        const orderAmount = response.data.order_amount;

        Wallet.findOne({ _id: walletId })
          .then((currentWallet) => {
            if (currentWallet) {
              currentWallet.balance += orderAmount;

              currentWallet
                .save()
                .then(() => {
                  console.log("Wallet updated successfully");
                  return res.redirect(`${FRONTEND_URL}/recharge`);
                })
                .catch((saveErr) => {
                  console.error("Error saving wallet:", saveErr);
                  return res.redirect(`${FRONTEND_URL}/recharge`);
                });
            } else {
              console.error("Wallet not found for user");
              return res.redirect(`${FRONTEND_URL}/recharge`);
            }
          })
          .catch((findErr) => {
            console.error("Error finding wallet:", findErr);
            return res.redirect(`${FRONTEND_URL}/recharge`);
          });
      } else {
        console.log("Payment not successful");
        return res.redirect(`${FRONTEND_URL}/recharge`);
      }
    })
    .catch((err) => {
      console.error("Error verifying payment:", err);
      return res.redirect(`${FRONTEND_URL}/recharge`);
    });
};

module.exports = {
  phonePe,
  handlePaymentOrder,
  handlePaymentRequest,
  initiatePayment
};
