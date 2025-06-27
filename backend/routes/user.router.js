const express = require("express");
const router = express.Router();
const {uploads}=require("../config/s3")

const userController=require("../Users/usersController");

const { isAuthorized } = require("../middleware/auth.middleware")

router.get('/getUserDetails',isAuthorized,userController.getUserDetails);
router.post('/getUserDetails',isAuthorized,userController.changeUser);
router.get('/getAllUsers',isAuthorized,userController.getUsers);
router.get('/getAllPlans',isAuthorized,userController.getAllPlans);
router.get('/getUsers',isAuthorized,userController.getAllUsers);
router.get("/getUserById",isAuthorized,userController.getUserById)
router.get('/AssignPlan/:userId/:planId',isAuthorized,userController.assignPlan);
router.post('/update-profile',isAuthorized,uploads.single("profileImage"),userController.updateProfile);

module.exports=router;