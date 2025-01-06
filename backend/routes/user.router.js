const express = require("express");
const router = express.Router();

const userController=require("../Users/usersController");

router.get('/getUserDetails',userController.getUserDetails);

module.exports=router;