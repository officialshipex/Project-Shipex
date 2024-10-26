const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.router');
const verficationRouter = require('./routes/kyc.router');
const shiprocket =require("./routes/courierB2C.router")

const app = express();

// parse JSON requests
app.use(express.json());
app.use(cors());

app.use('/v1/external', authRouter);
app.use('/v1/merchant', verficationRouter);
app.use("/v1/couriers", shiprocket);

module.exports = app;