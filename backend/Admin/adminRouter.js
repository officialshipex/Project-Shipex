const express = require("express");
const app = express.Router();
const {isAuthorized}=require("../middleware/auth.middleware")
const {getAllTransactionHistory,addWalletHistory}=require("./Billings/walletHistory")
const {getAllPassbookTransactions}=require("./Billings/passbooks")
const {getAllShippingTransactions}=require("./Billings/shipping")
const {getAllCodRemittance}=require("./Billings/codRemmitances")


app.get("/allTransactionHistory",getAllTransactionHistory);
app.post("/add-history",addWalletHistory)
app.get("/allPassbook",getAllPassbookTransactions)
app.get("/allShipping",getAllShippingTransactions)
app.get("/allCodRemittance",getAllCodRemittance)


module.exports = app;