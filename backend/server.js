const passport = require("passport");
const express = require("express");
const path = require("path");
const cors = require("cors");

const verficationRouter = require("./routes/kyc.router");
const shiprocket = require("./routes/courierB2C.router");
const authRouter = require("./routes/auth.router");
const helmet = require("helmet");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(passport.initialize());

app.use("/v1/external", authRouter);
app.use("/v1/merchant", verficationRouter);
app.use("/v1/couriers", shiprocket);

module.exports = app;
