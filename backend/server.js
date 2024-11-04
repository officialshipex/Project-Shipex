
const session = require('express-session');
const passport = require('passport');
const express = require("express");
const path = require('path');
const cors = require("cors");

const authRouter = require('./routes/auth.router');
const { default: helmet } = require('helmet');
const orderRouter = require('./routes/orders.router');
// require('./helpers/passport');
// const password = require('./config/passportConfig');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(passport.initialize());

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET
// }));

// app.use(passport.initialize());
// app.use(passport.session());


//only for testing purpose for backend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/upload',(req,res) => {
    return res.render("bulkOrder");
});

app.use('/v1/external', authRouter);
app.use('/v1/external',orderRouter);


module.exports = app;