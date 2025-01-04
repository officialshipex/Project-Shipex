const express = require("express");
const router = express.Router();

const XpressbeesAuthorizeController=require("../AllCouriers/Xpressbees/Authorize/XpressbeesAuthorize.controller");
const XpressbeesCouierController=require("../AllCouriers/Xpressbees/Courier/courier.controller");

router.get('/saveNew',XpressbeesAuthorizeController.saveXpressbees);
router.get('/isEnabeled',XpressbeesAuthorizeController.isEnabeled);
router.get('/disable',XpressbeesAuthorizeController.disable);

router.get('/getCourierList',XpressbeesCouierController.getCourierList);
router.post("/addService",XpressbeesCouierController.addService);

module.exports=router;