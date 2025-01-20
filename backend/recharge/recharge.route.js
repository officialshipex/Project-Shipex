const { phonePe, pay ,handlePaymentOrder,handlePaymentRequest} = require("./recharge.controller");
const rechargeRouter = require("express").Router();

// -----------PHONE PAY-------------------------------------------------------
rechargeRouter.get("/phonepe", phonePe);

// ---------------CASHFREE----------------------------------------------

rechargeRouter.post('/recharge',handlePaymentOrder);
rechargeRouter.get('/payment/:orderId/:walletId',handlePaymentRequest);

module.exports = rechargeRouter;