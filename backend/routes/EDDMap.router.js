const express=require("express");
const router=express.Router();

const {getAllCourier,getAllCourierService,getAllEddMap,addEDD,updateEDD,deleteEDD}=require("../Orders/EDDMap.controller")

router.get("/getAllCourier",getAllCourier)
router.get("/getAllCourierService",getAllCourierService)
router.get("/getAllEddMap",getAllEddMap);
router.post("/addEDD",addEDD);
router.put("/updateEDD/:id",updateEDD);
router.delete("/deleteEDD/:id",deleteEDD);


module.exports=router;