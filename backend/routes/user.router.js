const express = require("express");
const router = express.Router();

const userController=require("../Users/usersController");

const { isAuthorized } = require("../middleware/auth.middleware")

router.get('/getUserDetails',isAuthorized,userController.getUserDetails);
router.post('/getUserDetails',isAuthorized,userController.changeUser);
router.get('/getAllUsers',isAuthorized,userController.getUsers);
router.get('/getAllPlans',isAuthorized,userController.getAllPlans);
router.get('/getUsers',isAuthorized,userController.getAllUsers);
router.get("/getUserById",isAuthorized,userController.getUserById)
router.get('/AssignPlan/:userId/:planId',isAuthorized,userController.assignPlan);

module.exports=router;