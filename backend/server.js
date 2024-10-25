
const session = require('express-session');
const passport = require('passport');
const express = require("express");
const path = require('path');
const cors = require("cors");

const authRouter = require('./routes/auth.router');
const { default: helmet } = require('helmet');
const verficationRouter = require('./routes/kyc.router');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(passport.initialize());


app.use('/v1/external', authRouter);
app.use('/v1/external', authRouter);
app.use('/v1/merchant', verficationRouter);

module.exports = app;