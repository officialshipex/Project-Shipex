const transporter = require("./configEmailpass");

const sendWelcomeEmail = async (email, fullname) => {
  const mailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: email,
    subject: "Welcome to Shipex - Complete KYC & Unlock Exciting Offers!",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h3><span style="background:#fac123;">Hello</span> ${fullname},</h3>
        <h1><span style="background:#fac123;">Welcome</span> to Shipex,</h1>
        <p>We are thrilled to collaborate with Rudra Enterprises and assist you in courier service delivery.</p>
        <p>To ensure a smooth experience and compliance with regulations, we kindly request you to complete your KYC by uploading your GST and Aadhar details.</p>
        <p>Please reach out if you need any assistance or more details.</p>
        <p>Warm regards,</p>
        <p><strong>Team Shipdartexpress</strong></p>
      </body>
    </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendWelcomeEmail };
