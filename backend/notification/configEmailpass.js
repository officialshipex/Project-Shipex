require("dotenv").config(); // Load environment variables

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NOTIFICATION_EMAIL, // Ensure this is correctly set in .env
    pass: process.env.NOTIFICATION_PASS, // Ensure this is correctly set in .env
  },
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.zoho.com",
//   port: 587, // Use 587 if needed
//   secure: false, // Use false for port 587
//   auth: {
//     user: process.env.NOTIFICATION_EMAIL, // Your Zoho email
//     pass: process.env.NOTIFICATION_PASS, // Use App Password if 2FA is enabled
//   },
// });

module.exports = transporter;
