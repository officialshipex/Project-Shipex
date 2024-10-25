<<<<<<< HEAD

const session = require('express-session');
const passport = require('passport');
const express = require("express");
const path = require('path');
const cors = require("cors");

const authRouter = require('./routes/auth.router');
const { default: helmet } = require('helmet');
// require('./helpers/passport');
// const password = require('./config/passportConfig');
require('dotenv').config();
=======
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.router');
const verficationRouter = require('./routes/kyc.router');
>>>>>>> main

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

<<<<<<< HEAD
app.use(passport.initialize());

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use('/v1/external', authRouter);
=======
app.use('/v1/external', authRouter);
app.use('/v1/merchant', verficationRouter);
>>>>>>> main

module.exports = app;