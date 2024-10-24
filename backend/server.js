const indexRouter = require('./routes');
const session = require('express-session');
const passport = require('passport');
const express = require("express");
const config = require('./config');
const connection = require('./db');
const cors = require("cors");
const path = require('path');

require('./helpers/passport');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);

module.exports = app;