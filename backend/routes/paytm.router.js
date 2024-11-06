const express = require("express");
const router = express.Router();
const paytmController = require("../Paytm/paytm.controller");

router.post("/paynow", paytmController.initiatePayment);
router.post("/callback", paytmController.paytmCallback);

module.exports = router;
