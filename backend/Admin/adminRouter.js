const express = require("express");
const app = express.Router();
const {isAuthorized}=require("../middleware/auth.middleware")
const {getAllTransactionHistory,addWalletHistory}=require("./Billings/walletHistory")
const {getAllPassbookTransactions}=require("./Billings/passbooks")


app.get("/allTransactionHistory",getAllTransactionHistory);
app.post("/add-history",addWalletHistory)
app.get("/allPassbook",getAllPassbookTransactions)


module.exports = app;