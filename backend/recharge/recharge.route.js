const { phonePe, pay ,handlePaymentOrder,handlePaymentRequest} = require("./recharge.controller");
const rechargeRouter = require("express").Router();

// -----------PHONE PAY-------------------------------------------------------
rechargeRouter.post("/phonepe", phonePe);

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

rechargeRouter.post('/recharge',handlePaymentOrder);
// rechargeRouter.post('/createorder',RazorpayOrder);
rechargeRouter.get('/payment/:orderId/:walletId',handlePaymentRequest);

module.exports = rechargeRouter;