const express=require("express");
const router=express.Router();
const multer=require("multer");
const upload=multer({dest:'uploads/'});

const {downloadExcel,uploadDispreancy}=require("./weightDispreancy.controller");

router.post("/upload",upload.single('file'),uploadDispreancy);
router.get("/download-excel",downloadExcel)

module.exports=router;