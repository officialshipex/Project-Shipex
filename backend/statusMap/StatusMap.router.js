const express = require("express");
const router = express.Router();
const { fetchPartnerName,uploadExcel,getStatusByPartnerName } = require("./StatusMap.controller"); // adjust path
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Route to fetch all enabled couriers
router.get("/partnerName", fetchPartnerName);
router.post('/uploadStatus', upload.single('file'), uploadExcel);
router.get("/status", getStatusByPartnerName);

module.exports = router;
