const passport = require("passport");
const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const router = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', router);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;