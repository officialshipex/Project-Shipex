const { generateChecksum, verifyChecksum } = require("../utils/checkSum");
const Transaction = require("../models/transactions.model");

const PaytmConfig = {
  MID: "YOUR_MERCHANT_ID",
  KEY: "YOUR_MERCHANT_KEY",
  WEBSITE: "YOUR_WEBSITE_NAME",
  CHANNEL_ID: "WEB",
  INDUSTRY_TYPE_ID: "Retail",
  CALLBACK_URL: "http://localhost:5000/v1/paytm/callback",
};

exports.initiatePayment = (req, res) => {
  const { amount, customerId, customerEmail, customerPhone } = req.body;

  const params = {
    MID: PaytmConfig.MID,
    WEBSITE: PaytmConfig.WEBSITE,
    CHANNEL_ID: PaytmConfig.CHANNEL_ID,
    INDUSTRY_TYPE_ID: PaytmConfig.INDUSTRY_TYPE_ID,
    ORDER_ID: "ORDER" + new Date().getTime(),
    CUST_ID: customerId,
    TXN_AMOUNT: amount,
    CALLBACK_URL: PaytmConfig.CALLBACK_URL,
    EMAIL: customerEmail,
    MOBILE_NO: customerPhone,
  };

  params.CHECKSUMHASH = generateChecksum(params, PaytmConfig.KEY);

  res.json({
    paytmURL: "https://securegw-stage.paytm.in/order/process",
    params,
  });
};

exports.paytmCallback = async (req, res) => {
  const paytmChecksum = req.body.CHECKSUMHASH;
  const paytmParams = { ...req.body };
  delete paytmParams.CHECKSUMHASH;

  const isVerifySignature = verifyChecksum(
    paytmParams,
    PaytmConfig.KEY,
    paytmChecksum
  );
  if (isVerifySignature) {
    const status = paytmParams.STATUS;

    // Save transaction details to the database
    const transaction = new Transaction({
      orderId: paytmParams.ORDERID,
      customerId: paytmParams.CUST_ID,
      amount: paytmParams.TXNAMOUNT,
      status: status,
      transactionId: paytmParams.TXNID,
    });

    try {
      await transaction.save();
      res.json({
        success: status === "TXN_SUCCESS",
        message:
          status === "TXN_SUCCESS"
            ? "Transaction Successful"
            : "Transaction Failed",
        data: paytmParams,
      });
    } catch (error) {
      res.json({ success: false, message: "Database Error", error });
    }
  } else {
    res.json({ success: false, message: "Checksum Mismatch" });
  }
};
