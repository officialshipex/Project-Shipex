const express = require("express");
const cors = require("cors");
const config = require('./config');
const connection = require('./db');
const session = require('express-session');
const app = express();

require('dotenv').config();
const path = require('path');
require('./helpers/passport');
const passport = require('passport');

const PORT = config.PORT;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory (if not in the default 'views' folder)
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(cors());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());

// Import routes
const indexRouter = require('./routes');

// Use the router
app.use('/', indexRouter);

console.log("It's running");

app.listen(PORT, async () => {
  console.log(`Server started on https://localhost:${PORT}`);
  connection();
});
