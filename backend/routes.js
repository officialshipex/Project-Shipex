const express = require("express");
const router = express.Router();

const authRouter = require("./routes/auth.router");
const { isAuthorized } = require("./middleware/auth.middleware");

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
const XpressbeesController = require("./AllCouriersRoutes/xpressbee.router");
const shreeMarutiController = require("./AllCouriersRoutes/shreemaruti.router");
const SmartShipController = require("./AllCouriersRoutes/smartShip.router");
const DelhiveryController = require("./AllCouriersRoutes/delhivery.router");
const LabelRouter = require("./label/label.router");
const couriersB2CRoutes = require("./routes/couriersB2C.router");
// const courierServicesRoutes=require('./routes/courierServiceB2C.router');

const allocationRouter = require("./addons/orderAllocationEngine/OAE.router");
const userRouter = require("./routes/user.router");
const WareHouse = require("./routes/warehouse.router");
const bulkOrderUploadRoutes = require("./routes/bulkOrderUpload.router");
const PrintLabelRoute = require("./label/printLabel.controller");
const PrintInvoice = require("./label/printInvoice.controller");
const PrintManifest=require("./label/printManifest.controller")
const AllCourierRoutes = require("./routes/allCourierRoutes");
const CourierServiceRoutes = require("./routes/courierServies.router");

//rate
const RateCalculate=require("./routes/Ratecalculate.router")
router.use("/ratecalculate",isAuthorized,RateCalculate)

router.use("/allCourier", AllCourierRoutes);
const newOrderRoute = require("./routes/newOrder.router");

const Razorpay=require("./recharge/recharge.route")

router.use("/external", authRouter);

router.use("/merchant", isAuthorized, verficationRouter);
router.use("/allocation", isAuthorized, allocationRouter);

router.use("/paytm", paytmRoutes);
router.use("/recharge", rechargeRouter);
router.use("/razorpay",Razorpay)
router.use('/courierServices',CourierServiceRoutes)

// router.use('/order', orderRouter);
router.use("/order", isAuthorized, newOrderRoute);
// router.use("/order", orderRouter);
//create product route
// router.use("/products",productRouter)

router.use("/users", userController);
router.use("/calculateRate", calculateRouter);
router.use("/getServices", servicesController);

router.use("/saveRate", saveRateRouter);
router.use("/getBaseRate", getBaseRateController);
router.use("/saveBaseRate", saveBaseRateController);
router.use("/saveCustomRate", customRateController);
// router.use('/editBaseRate', editBaseRateController);

router.use("/NimbusPost", NimbusPostController);
router.use("/Shiprocket", ShipRocketController);
router.use("/EcomExpress", EcomExpressController);
router.use("/Xpressbees", XpressbeesController);
router.use("/ShreeMaruti", shreeMarutiController);
router.use("/SmartShip", SmartShipController);

router.use("/Delhivery", DelhiveryController);

router.use("/label", LabelRouter);
router.use("/user", isAuthorized, userRouter);
router.use("/warehouse", WareHouse);
router.use("/bulkOrderUpload", bulkOrderUploadRoutes);
router.use("/printlabel", PrintLabelRoute);
router.use("/printinvoice", PrintInvoice);
router.use("/manifest",PrintManifest)


router.use("/B2Ccouries", couriersB2CRoutes);

// app.use("/v1/courierServices", courierServicesRoutes);

module.exports = router;
