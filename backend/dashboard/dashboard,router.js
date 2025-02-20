const express = require('express');
const router = express.Router();

const {dashboard}=require("./dashboard.controller")


router.get("/dashboard",dashboard)

module.exports = router;