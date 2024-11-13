const passport = require("passport");
const express = require("express");
const helmet  = require('helmet');
const cors = require("cors");

const courierServicesRoutes=require('./routes/courierServiceB2C.router')
const shiprocketRoutes = require('./routes/courierServiceB2C.router');
const { isAuthorized } = require('./middleware/auth.middleware');
const rechargeRouter = require("./recharge/recharge.route");
const verficationRouter = require("./routes/kyc.router");
const shiprocket =require("./routes/courierB2C.router")
const paytmRoutes = require("./routes/paytm.router");
const authRouter = require("./routes/auth.router");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(passport.initialize());

app.use('/v1/external', authRouter);
app.use('/v1/merchant',  isAuthorized, verficationRouter);
app.use('/v1/recharge', rechargeRouter);

// app.use("/v1/couriers", shiprocket);
app.use("/v1/courierServices", courierServicesRoutes);
app.use("/v1/paytm", paytmRoutes);


app.use('/v1/shiprocket', shiprocketRoutes);




module.exports = app;