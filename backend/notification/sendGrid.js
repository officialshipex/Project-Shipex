// config/sendgrid.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not set in .env');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

module.exports = sgMail;
