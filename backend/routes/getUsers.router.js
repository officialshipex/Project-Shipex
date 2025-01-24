const express = require("express");
const router = express.Router();

const userController=require("../Users/usersController");

router.get("/",userController.getUsers);


router.post("/getRateCard",userController.getRatecards);

module.exports=router;