const express = require('express');
const cors = require('cors');
const router = require('./routes/router');

const app = express();

// parse JSON requests
app.use(express.json());
app.use(cors());

app.use('/v1/external',router)

module.exports = app;