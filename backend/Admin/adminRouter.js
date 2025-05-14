const express = require("express");
const app = express.Router();
const {isAuthorized}=require("../middleware/auth.middleware")
const {getAllTransactionHistory,addWalletHistory}=require("./Billings/walletHistory")
const {getAllPassbookTransactions}=require("./Billings/passbooks")
const {getAllShippingTransactions}=require("./Billings/shipping")


app.get("/allTransactionHistory",getAllTransactionHistory);
app.post("/add-history",addWalletHistory)
app.get("/allPassbook",getAllPassbookTransactions)
app.get("/allShipping",getAllShippingTransactions)


module.exports = app;