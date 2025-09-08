const express = require("express");
const router = express.Router();
const { fetchCourier,uploadExcel } = require("./StatusMap.controller"); // adjust path
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Route to fetch all enabled couriers
router.get("/couriers", fetchCourier);
router.post('/uploadStatus', upload.single('file'), uploadExcel);

module.exports = router;
