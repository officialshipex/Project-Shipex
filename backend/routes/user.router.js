const express = require("express");
const router = express.Router();

const userController=require("../Users/usersController");

router.get('/getUserDetails',userController.getUserDetails);
router.get('/getAllUsers',userController.getUsers);
router.get('/getAllPlans',userController.getAllPlans);
router.get('/AssignPlan/:userId/:planId',userController.assignPlan);
;
module.exports=router;