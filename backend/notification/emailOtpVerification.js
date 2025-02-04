const transporter = require("./configEmailpass");
const express = require("express");
const OTPs = {}; // Store OTPs temporarily
const emailOtpRouter = express.Router();
emailOtpRouter.post("/send-email-otp", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    OTPs[email] = otp; // Store OTP temporarily
  
    // Email Content
    const mailOptions = {
      from: process.env.NOTIFICATION_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  });
  emailOtpRouter.post("/verify-email-otp", (req, res) => {
    const { email, otp } = req.body;
  
    if (!OTPs[email] || OTPs[email] != otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  
    delete OTPs[email]; // Remove OTP after verification
    res.json({ success: true, message: "Email verified successfully" });
  })

  module.exports = emailOtpRouter