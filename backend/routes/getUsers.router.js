const express = require("express");
const router = express.Router();

const userController=require("../Users/usersController");

router.get("/",userController.getUsers);

module.exports=router;