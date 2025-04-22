const express = require("express");
const router = express.Router();
const { getOrdersByStatus,searchUser,getAllOrdersByNdrStatus,getAllOrdersByManualRtoStatus } = require("../Admin/order");
const {getDashboardStats}=require("../Admin/dashboard")

router.get("/adminOrder", getOrdersByStatus);
router.get("/searchUser",searchUser)
router.get("/adminNdr",getAllOrdersByNdrStatus)
router.get("/manualRto",getAllOrdersByManualRtoStatus)
router.get("/dashboard",getDashboardStats)

module.exports = router;
