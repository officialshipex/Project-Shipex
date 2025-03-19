const express=require("express");
const router=express.Router();
const multer=require("multer");
const upload=multer({dest:'uploads/'});

const {downloadExcel,uploadDispreancy,AllDiscrepancy,AllDiscrepancyBasedId,AcceptDiscrepancy}=require("./weightDispreancy.controller");

router.post("/upload",upload.single('file'),uploadDispreancy);
router.get("/download-excel",downloadExcel)
router.get("/allDispreancy",AllDiscrepancy)
router.get("/allDispreancyById",AllDiscrepancyBasedId)
router.post("/acceptDiscrepancy",AcceptDiscrepancy)

module.exports=router;