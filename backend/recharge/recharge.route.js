const { createOrder,razorpayWebhook,getWalletHistoryByUserId} = require("./recharge.controller");
const express = require("express");
const rechargeRouter = express.Router();
const {isAuthorized}=require("../middleware/auth.middleware")
const {getAllTransactionHistory}=require("../Admin/Billings/walletHistory")

// -----------PHONE PAY-------------------------------------------------------
// rechargeRouter.post("/phonepe", phonePe);

// rechargeRouter.post('/redirect-url/:merchantTransactionId',(req,res)=>{
//     const { merchantTransactionId } = req.params
//     console.log('merchantTransactionId',merchantTransactionId)
//     if(merchantTransactionId){
//         res.send({merchantTransactionId})
//     }else{
//         res.send({error:'error'})
//     }
// })

// ---------------CASHFREE----------------------------------------------

//=============Razorpay============
rechargeRouter.post("/create-order",createOrder)
rechargeRouter.post("/razorpay-webhook", express.json({ verify: (req, res, buf) => { req.rawBody = buf } }), razorpayWebhook);
rechargeRouter.get("/transactionHistory",isAuthorized,getWalletHistoryByUserId);
rechargeRouter.get("/allTransactionHistory",isAuthorized,getAllTransactionHistory);
//==============Razorpay================
// rechargeRouter.post('/recharge',handlePaymentOrder);
// rechargeRouter.post('/createorder',RazorpayOrder);
// rechargeRouter.get('/p*ayment/:orderId/:walletId',handlePaymentRequest);

module.exports = rechargeRouter;