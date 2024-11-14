const { phonePe, pay } = require("./recharge.controller");
const rechargeRouter = require("express").Router();

rechargeRouter.get("/phonepe", phonePe);

module.exports = rechargeRouter;