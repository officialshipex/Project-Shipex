const express = require("express");
const router = express.Router();
const { getOrdersByStatus,searchUser,getAllOrdersByNdrStatus } = require("../Admin/order");

router.get("/adminOrder", getOrdersByStatus);
router.get("/searchUser",searchUser)
router.get("/adminNdr",getAllOrdersByNdrStatus)

module.exports = router;
