const { phonePe, pay } = require("./recharge.controller");
const rechargeRouter = require("express").Router();

rechargeRouter.get("/pay", pay);
rechargeRouter.get("/phonepe", phonePe);

module.exports = rechargeRouter;