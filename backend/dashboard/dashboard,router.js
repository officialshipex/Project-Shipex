const express = require('express');
const router = express.Router();

const {dashboard,getBusinessInsights,getDashboardOverview,getOverviewGraphsData,getOverviewCardData}=require("./dashboard.controller")


router.get("/dashboard",dashboard)
router.get("/getBusinessInsights",getBusinessInsights)
router.get("/getDashboardOverview",getDashboardOverview)
router.get("/getOverviewGraphsData",getOverviewGraphsData)
router.get("/getOverviewCardData",getOverviewCardData)

module.exports = router;