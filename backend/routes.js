const express = require("express");
const router=express.Router();

const authRouter = require("./routes/auth.router");
const { isAuthorized } = require('./middleware/auth.middleware');

const paytmRoutes = require("./routes/paytm.router");
const verficationRouter = require("./routes/kyc.router");
const rechargeRouter = require("./recharge/recharge.route");


const orderRouter = require("./routes/orders.router");

const userController = require("./routes/getUsers.router");
const servicesController = require("./routes/getServices.router");
const calculateRouter = require("./routes/calculateRate.router");

const saveRateRouter = require("./routes/saveRate.router");
const getBaseRateController = require("./routes/getBaseRate.router");
const saveBaseRateController = require("./routes/saveBaseRate.router");
const customRateController = require("./routes/saveCustomRate.router");
// const editBaseRateController = require("./routes/editBaseRate.router");


const EcomExpressController = require("./AllCouriersRoutes/ecom.router");
const NimbusPostController = require("./AllCouriersRoutes/nimbuspost.router");
const ShipRocketController = require("./AllCouriersRoutes/shiprocket.router");
const XpressbeesController=require("./AllCouriersRoutes/xpressbee.router");
const shreeMarutiController=require("./AllCouriersRoutes/shreemaruti.router");
const SmartShipController=require("./AllCouriersRoutes/smartShip.router");
const DelhiveryController=require("./AllCouriersRoutes/delhivery.router");
const LabelRouter = require('./label/label.router');

const userRouter=require("./routes/user.router");
const WareHouse=require("./routes/warehouse.router");



router.use('/external', authRouter);

router.use('/merchant', isAuthorized, verficationRouter);

router.use("/paytm", paytmRoutes);
router.use('/recharge', rechargeRouter);

router.use('/order', orderRouter);

router.use('/users', userController);
router.use('/calculateRate', calculateRouter);
router.use('/getServices', servicesController);

router.use('/saveRate', saveRateRouter);
router.use('/getBaseRate', getBaseRateController);
router.use('/saveBaseRate', saveBaseRateController);
router.use('/saveCustomRate', customRateController);
// router.use('/editBaseRate', editBaseRateController);

router.use("/NimbusPost", NimbusPostController);
router.use("/Shiprocket", ShipRocketController);
router.use("/EcomExpress", EcomExpressController);
router.use("/Xpressbees",XpressbeesController);
router.use("/ShreeMaruti",shreeMarutiController);
router.use("/SmartShip",SmartShipController);

router.use('/delhivery',DelhiveryController);

router.use("/label", LabelRouter);
router.use('/user',isAuthorized,userRouter);
router.use('/warehouse',WareHouse);

module.exports = router;