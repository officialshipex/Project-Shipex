const passport = require("passport");
const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// // const courierServicesRoutes=require('./routes/courierServiceB2C.router')
// const isAuthorized  = require('./middleware/auth.middleware');
// const rechargeRouter = require("./recharge/recharge.route");

// const orderRouter=require("./routes/orders.router");

// const calculateRouter=require("./routes/calculateRate.router");
// const saveRateRouter=require("./routes/saveRate.router");
// const servicesController=require("./routes/getServices.router");
// const saveBaseRateController=require("./routes/saveBaseRate.router");
// const getBaseRateController=require("./routes/getBaseRate.router");
// const userController=require("./routes/getUsers.router");
// const customRateController=require("./routes/saveCustomRate.router");
// // const editBaseRateController=require("./routes/editBaseRate.router");

// const NimbusPostController=require("./AllCouriersRoutes/nimbuspost.router");
const ShipRocketController=require("./AllCouriersRoutes/shiprocket.router");
// const EcomExpressController=require("./AllCouriersRoutes/ecom.router");
const ShreeMarutiController=require("./AllCouriersRoutes/shreemaruti.router")

// const verficationRouter = require("./routes/kyc.router");
// const paytmRoutes = require("./routes/paytm.router");
// const authRouter = require("./routes/auth.router");

// const WoocommerceController=require("./AllCouriersRoutes/woocommerce.router")
const delhiveryRouter=require("./AllCouriersRoutes/delhivery.router")



// const WareHouse=require("./routes/warehouse.router");
const session=require('express-session');
const MongoStore=require('connect-mongo');

const store=MongoStore.create({
    mongoUrl:process.env.MONGODB_URI,
    crypto:{
        secret:process.env.MONGO_SECRET,
    },
    touchAfter:24*3600
});
store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",err);
    })
    
    const sessionOptions={
        store,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24*7 
        }
    }

const router = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

    
 app.use(session(sessionOptions));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/v1', router);

// app.use('/v1/external', authRouter);
// app.use('/v1/merchant',  isAuthorized, verficationRouter);
// app.use('/v1/recharge', rechargeRouter);

// // app.use("/v1/couriers", shiprocket);
// // app.use("/v1/courierServices", courierServicesRoutes);
// app.use("/v1/paytm", paytmRoutes);


// app.use('/v1/calculateRate',calculateRouter);
// app.use('/v1/saveRate',saveRateRouter);
// app.use('/v1/getServices',servicesController);
// app.use('/v1/saveBaseRate',saveBaseRateController);
// app.use('/v1/getBaseRate',getBaseRateController);
// app.use('/v1/users',userController);
// app.use('/v1/saveCustomRate',customRateController);
// // app.use('/v1/editBaseRate',editBaseRateController);


// app.use("/v1/order",orderRouter);



// app.use("/v1/NimbusPost",NimbusPostController);
// app.use("/v1/Shiprocket",ShipRocketController);
// app.use("/v1/Xpressbees",XpressbeesController);
// app.use("/v1/ShreeMaruti",shreeMarutiController);
// app.use("/v1/SmartShip",SmartShipController);
// // app.use("/v1/EcomExpress",EcomExpressController);


// app.use("/v1/B2Ccouries",couriersB2CRoutes);

// app.use('/v1/warehouse',WareHouse);


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// app.use("/v1/NimbusPost",NimbusPostController);
app.use("/v1/Shiprocket",ShipRocketController);
// app.use("/v1/EcomExpress",EcomExpressController);
app.use("/v1/shreeMaruti",ShreeMarutiController);
// app.use("/v1/woocommerce",WoocommerceController);
app.use("/v1/delhivery",delhiveryRouter)


module.exports = app;
