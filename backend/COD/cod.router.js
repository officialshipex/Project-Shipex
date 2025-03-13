const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  codPlanUpdate,
  codRemittanceData,
  getCodRemitance,
  codRemittanceRecharge,
  getAdminCodRemitanceData,
  downloadSampleExcel,
  uploadCodRemittance,
  CheckCodplan,
  remittanceTransactionData,
  courierCodRemittance
} = require("./cod.controller");
router.post("/codPlanUpdate", codPlanUpdate);
router.get("/codRemittanceData", codRemittanceData);
router.get("/getCodRemitance", getCodRemitance);
router.post("/codRemittanceRecharge", codRemittanceRecharge);
router.get("/getAdminCodRemitanceData",getAdminCodRemitanceData)
router.get("/download-excel",downloadSampleExcel)
router.post('/upload', upload.single('file'), uploadCodRemittance);
router.get("/CheckCodplan",CheckCodplan)
router.get("/remittanceTransactionData/:id",remittanceTransactionData)
router.get("/courierCodRemittance",courierCodRemittance)
module.exports = router;
