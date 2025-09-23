const transporter = require("./configEmailpass");


const sendWelcomeEmail = async (email, customername) => {
  const mailOptions = {
    from: '"Shipex Team" <support@shipexindia.com>',
    to: email,
    subject: "Welcome to Shipex India! Start Shipping in 6 Simple Steps",
    html: `
      <table cellspacing="0" cellpadding="0" style="margin: 0 auto; width: 100%; background-color: #f9f9f9;">
        <tbody>
          <tr>
            <td>
              <div style="background: #fff; border: 1px solid #eee; font-family: Lato, Helvetica, Arial, sans-serif; margin: 32px auto; max-width: 600px; border-radius: 8px; overflow: hidden;">
                <!-- Header with logo -->
                <div style="background-color: #0CBB7D; text-align: center; padding: 30px;">
                  <img src="https://shipex-india.s3.ap-south-1.amazonaws.com/uploads/1758633150031_Shipex.jpg" alt="Shipex Logo" style="max-height: 60px; width: auto;" />
                </div>

                <div style="padding: 36px 36px 24px; text-align: center;">
                  <h2 style="margin: 0 0 12px; color: #183765; font-size: 22px; font-weight: 700;">Welcome to Shipex India!</h2>
                  <h4 style="margin: 0 0 18px; color: #212121; font-size: 16px; font-weight: 400;">Dear ${customername},</h4>
                  <p style="font-size: 15px; color: #444; margin: 0 0 20px;">
                    We're excited to have you onboard and ready to offer you the best shipping experience 🚀
                  </p>
                  <!-- Button -->
                  <a href="https://shipexindia.com" target="_blank" 
                    style="display: inline-block; background-color: #0CBB7D; color: #fff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 6px; margin: 10px auto 30px; cursor: pointer;">
                    Explore Website
                  </a>

                  <div style="margin: 30px 0 24px; background: #f0f4fa; border-radius: 6px; padding: 18px 18px 16px; text-align: left;">
                    <strong style="color:#183765; display:block; margin-bottom:7px;">Get Started in 6 Simple Steps:</strong>
                    <ol style="margin:0 0 0 18px; padding:0; color:#444; font-size:14px;">
                      <li>KYC: Submit GST, PAN & COI (No GST? Select Proprietorship to onboard without GST/CIN).</li>
                      <li>Bank Details: Add account for COD settlements.</li>
                      <li>Pickup Address: Configure your pickup location.</li>
                      <li>Orders: Link your marketplaces for automatic order sync.</li>
                      <li>Wallet: Recharge to start shipping.</li>
                    </ol>
                  </div>
                  <div style="margin: 16px 0 20px; background: #eaf6e3; border-left: 4px solid #2ca244; padding: 15px 20px 10px; text-align:left; border-radius: 5px;">
                    <strong style="color:#183765; display:block; margin-bottom:6px;">Why Shipex?</strong>
                    <ul style="margin:0; padding:0 0 0 16px; color:#444; font-size:14px;">
                      <li>Best shipping rates guaranteed</li>
                      <li>No volumetric weight upto 2KG</li>
                      <li>Simplified order & invoice management</li>
                      <li>Quick COD settlements</li>
                      <li>Real-time tracking & dispute support</li>
                      <li>Multiple pickup address options</li>
                      <li>Smart dashboard & insights</li>
                    </ul>
                  </div>
                  <p style="margin:0 0 10px; font-size: 14px; color: #444;">Need help? Our support team is just a call away!</p>
                  <div style="margin-top:12px; font-size: 13px; color: #212121;">
                    <span style="display:block;">Thanks & Regards,<br>Team Shipex India</span>
                    <span style="display:block; margin-top:7px;">
                      Mail - <a href="mailto:support@shipexindia.com" style="color:#0CBB7D;text-decoration:none;">support@shipexindia.com</a>
                    </span>
                    <span style="display:block;">
                      Call - +91 9813981344
                    </span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
