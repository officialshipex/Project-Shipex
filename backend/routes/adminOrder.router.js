const express = require("express");
const router = express.Router();
const { getOrdersByStatus,searchUser } = require("../Admin/order");

router.get("/adminOrder", getOrdersByStatus);
router.get("/searchUser",searchUser)

module.exports = router;
