const express = require("express");
const router = express.Router();

const saveRateController=require("../Rate/saveRateCardController");

router.post("/",saveRateController.saveRate);