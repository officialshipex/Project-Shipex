const express = require("express");
const app = express.Router();
const {isAuthorized}=require("../middleware/auth.middleware")
const {getAllTransactionHistory,addWalletHistory,addPassbook,walletUpdation,searchAwb,reverseTransaction}=require("./Billings/walletHistory")
const {getAllPassbookTransactions}=require("./Billings/passbooks")
const {getAllShippingTransactions}=require("./Billings/shipping")
const {getAllCodRemittance}=require("./Billings/codRemmitances")


app.get("/allTransactionHistory", isAuthorized, getAllTransactionHistory);
app.post("/add-history",addWalletHistory)
app.post("/walletUpdation",walletUpdation);
app.post("/reverseTransaction",reverseTransaction)
app.get("/searchAwb",searchAwb)
app.post("/add-passbook",addPassbook);
app.get("/allPassbook", isAuthorized, getAllPassbookTransactions)
app.get("/allShipping", isAuthorized, getAllShippingTransactions)
app.get("/allCodRemittance", isAuthorized, getAllCodRemittance)


module.exports = app;