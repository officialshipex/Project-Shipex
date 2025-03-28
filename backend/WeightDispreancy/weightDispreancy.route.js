const express=require("express");
const router=express.Router();
const multer=require("multer");
const upload=multer({dest:'uploads/'});
const { uploads } = require("../config/s3");

const {downloadExcel,uploadDispreancy,AllDiscrepancy,AllDiscrepancyBasedId,AcceptDiscrepancy,AcceptAllDiscrepancies,raiseDiscrepancies,adminAcceptDiscrepancy,declineDiscrepancy}=require("./weightDispreancy.controller");

router.post("/upload",upload.single('file'),uploadDispreancy);
router.get("/download-excel",downloadExcel)
router.get("/allDispreancy",AllDiscrepancy)
router.get("/allDispreancyById",AllDiscrepancyBasedId)
router.post("/acceptDiscrepancy",AcceptDiscrepancy)
router.post("/acceptAllDiscrepancies",AcceptAllDiscrepancies)
router.post("/raiseDiscrepancies", uploads.single("image"), raiseDiscrepancies);
router.post("/adminAcceptDiscrepancy",adminAcceptDiscrepancy)
router.post("/declineDiscrepancy",declineDiscrepancy)
// router.get("/all", getAllPosts);

module.exports=router;