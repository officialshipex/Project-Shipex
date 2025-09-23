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
  const mailOptions = {
    from: '"Shipex Team" <support@shipexindia.com>',
    to: email,
    subject: "Your OTP Code",
    html: `<table cellspacing="0" cellpadding="0" style="background-color: #F4F6F7; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #DEE6E9; border-radius: 10px; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: auto; max-width: 600px; overflow: hidden; width: 600px;">

                    <div
                        style="background-color: #25586B; padding: 40px; text-align: center; background-image: url(../images/sampleTemplates/otp.svg); background-repeat: no-repeat; background-position: calc( 100% - 20px ) 20px; background-size: 50px;">
                        <h2 style="color: #3F2955; margin: 0px;">
                            <span class="size" style="font-size: 32px"><i>Shipex India</i></span><br></h2>
                    </div>
                    <div
                        style="padding: 40px 50px; background-image: url(../images/sampleTemplates/shadow.svg); background-repeat: no-repeat; background-position: top; background-size: contain;">
                        <p style="font-size: 14px; margin: 0; margin-bottom: 25px;">Hi </p>
                        <p style="font-size: 16px; margin: 0; margin-bottom: 35px; line-height: 22px;">
                            Verify you email address. Below is your
                            <strong>One time password:</strong>
                        </p>
                        <div style="text-align: center;">
                            <div
                                style="background-color: #25586B0D; border-radius: 6px; color: #25586B; display: inline-block; font-size: 30px; padding: 20px 30px;">
                                ${otp}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; margin-top: 15px;">
                            <div
                                style="background-image: url(../images/sampleTemplates/copy.svg); background-repeat: no-repeat; background-size: contain; height: 14px; width: 14px;">
                            </div>
                        </div>
                        <p style="font-size: 14px; margin: 0; margin: 35px 0;  line-height: 22px;">If you didn't request
                            this one time password, ignore the email.</p>
                        <p style="font-size: 14px; margin: 0; margin-bottom: 35px; line-height: 22px;">If you'd like to
                            know more about Shipex or want to get in touch with us, get in touch with our
                            customer support team.</p>
                        <p style="font-size: 14px; margin: 0; line-height: 22px;">Thank you,</p>
                        <p style="font-size: 14px; margin: 0; line-height: 22px;">Team Shipex</p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>`,
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




// const express = require('express');
// const sgMail = require('./sendGrid');
// const router = express.Router();

// // In-memory stores (for demo). Use Redis for production.
// const OTPs = new Map(); // email -> { otp, expiresAt, timeoutId }
// const sendAttempts = new Map(); // email -> { count, firstRequestTs }

// const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
// const MAX_PER_WINDOW = 3; // max OTPs allowed per window
// const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// function canSendOtp(email) {
//   const now = Date.now();
//   const rec = sendAttempts.get(email);
//   if (!rec) {
//     sendAttempts.set(email, { count: 0, firstRequestTs: now });
//     return true;
//   }
//   if (now - rec.firstRequestTs > WINDOW_MS) {
//     // reset window
//     sendAttempts.set(email, { count: 0, firstRequestTs: now });
//     return true;
//   }
//   return rec.count < MAX_PER_WINDOW;
// }

// function incrementSendCount(email) {
//   const now = Date.now();
//   const rec = sendAttempts.get(email) || { count: 0, firstRequestTs: now };
//   rec.count = (rec.count || 0) + 1;
//   sendAttempts.set(email, rec);
// }

// router.post('/send-email-otp', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

//   if (!canSendOtp(email)) {
//     return res.status(429).json({
//       success: false,
//       message: `Too many OTP requests. Try again later.`,
//     });
//   }

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Clear any existing OTP for this email
//   if (OTPs.has(email)) {
//     const prev = OTPs.get(email);
//     clearTimeout(prev.timeoutId);
//   }

//   // Auto-expire OTP after TTL
//   const timeoutId = setTimeout(() => {
//     OTPs.delete(email);
//   }, OTP_TTL_MS);

//   OTPs.set(email, { otp, expiresAt: Date.now() + OTP_TTL_MS, timeoutId });

//   // increment send count
//   incrementSendCount(email);

//   // Build email HTML (you can use your template)
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee;">
//       <h2 style="color:#1B3E71">Your Shipex OTP</h2>
//       <p>Hi,</p>
//       <p>Your One-Time Password (OTP) is:</p>
//       <div style="font-size:28px; font-weight:700; color:#25586B; margin:16px 0;">${otp}</div>
//       <p>This code will expire in 5 minutes. If you did not request this, please ignore.</p>
//       <p>Thanks,<br/>Team Shipex</p>
//     </div>
//   `;

//   const msg = {
//     to: email,
//     from: "support@shipexindia.com",
//     subject: 'Your Shipex OTP Code',
//     html,
//   };

//   try {
//     await sgMail.send(msg); // returns a Promise
//     return res.json({ success: true, message: 'OTP sent successfully' });
//   } catch (err) {
//     console.error('SendGrid error:', err.response ? err.response.body : err.message);
//     // cleanup on failure
//     const stored = OTPs.get(email);
//     if (stored) {
//       clearTimeout(stored.timeoutId);
//       OTPs.delete(email);
//     }
//     return res.status(500).json({ success: false, message: 'Failed to send OTP', detail: err.response ? err.response.body : err.message });
//   }
// });

// router.post('/verify-email-otp', (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

//   const stored = OTPs.get(email);
//   if (!stored) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

//   if (stored.otp !== otp.toString()) {
//     return res.status(400).json({ success: false, message: 'Invalid OTP' });
//   }

//   // success: clear OTP and its timeout
//   clearTimeout(stored.timeoutId);
//   OTPs.delete(email);

//   return res.json({ success: true, message: 'Email verified successfully' });
// });

// module.exports = router;

