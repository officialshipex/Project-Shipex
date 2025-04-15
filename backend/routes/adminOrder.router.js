const express = require("express");
const router = express.Router();
const { getOrdersByStatus } = require("../Admin/order");

router.get("/adminOrder", getOrdersByStatus);

module.exports = router;
