const transporter = require("./configEmailpass");
const express = require("express");
const OTPs = {}; // Store OTPs temporarily
const emailOtpRouter = express.Router();
const axios = require("axios");
emailOtpRouter.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  console.log("kkkk", email);
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  OTPs[email] = otp; // Store OTP temporarily
  console.log("9999", otp);
  // Email Content
  const validTime = "10 minutes"; // example expiry, replace with actual expiration time

  const mailOptions = {
    from: '"Shipex Team" <info@shipexindia.com>',
    to: email,
    subject: "Your Verification Code",
    html: `
    <table cellspacing="0" cellpadding="0" style="margin:0 auto; width:100%; background-color:#f9f9f9;">
      <tr>
        <td>
          <div style="background:#fff; border:1px solid #eee; font-family:Lato, Helvetica, Arial, sans-serif; margin:32px auto; max-width:500px; border-radius:16px; overflow:hidden; box-sizing:border-box;">
            <!-- Header with logo -->
            <div style="padding: 25px 0 25px 0;background:#eee;text-align: center;">
              <img src="https://shipex-india.s3.ap-south-1.amazonaws.com/uploads/1758806046534_shipexNoBG.png" alt="Shipex Logo" style="max-height: 60px; width: auto;" />
            </div>

            <div style="padding:20px 24px; text-align:center;">
              <h1 style="color:#222; font-size:24px; font-weight:700; margin:0 0 16px;">Verification code</h1>
              <p style="font-size:15px; color:#222; margin-bottom:24px;">
                Enter the below one time password to verify your Shipex account:
              </p>
              <div style="font-size:28px; font-weight:600; color:#1658db; margin-bottom:8px;">
                ${otp}
              </div>
              <div style="margin-top:2px; font-size:14px; color:#b60000;">
                The verification code expires in ${validTime}
              </div>
              <hr style="border:0; border-bottom:1px solid #eee; margin:28px 0 16px;">
              <p style="font-size:15px; color:#232323; margin-bottom:8px;">
                If you have further questions, write to us at 
                <a href="mailto:info@shipexindia.com" style="color:#0CBB7D;">info@shipexindia.com</a> and our team will get back to you.
              </p>
              <div style="margin-top:18px; font-size:15px; color:#444;">
                Have a great day!<br>
                <span style="font-weight:700;">Team Shipex India</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  `,
  };

  try {
    console.log("email", process.env.NOTIFICATION_EMAIL);
    console.log("pass", process.env.NOTIFICATION_PASS);
    const mails = await transporter.sendMail(mailOptions);
    console.log("hhhhhh", mails);
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
});

module.exports = emailOtpRouter;
