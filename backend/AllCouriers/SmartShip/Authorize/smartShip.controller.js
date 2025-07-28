require("dotenv").config();
const axios = require("axios");
const AllCourier = require("../../../models/AllCourierSchema");
const USERNAME = process.env.SMARTSHIP_USERNAME;
const PASSWORD = process.env.SMARTSHIP_PASSWORD;
const getAccessToken = async () => {
  const credentials = {
    username: process.env.SMARTSHIP_USERNAME,
    password: process.env.SMARTSHIP_PASSWORD,
    client_id: process.env.SMARTSHIP_CLIENT_ID,
    client_secret: process.env.SMARTSHIP_CLIENT_SECRET,
    grant_type: "password",
  };

  try {
    const response = await axios.post(
      "https://oauth.smartship.in/loginToken.php",
      credentials,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.log("Error fetching access token:", error.response);
    return error.response.data;
  }
};

const saveSmartShip = async (req, res) => {
  const { username, password } = req.body.credentials; // Destructure credentials
  const { courierName, courierProvider, CODDays, status } = req.body; // Destructure courier data
  console.log(PASSWORD);

  // Validate if the provided credentials match the expected ones
  if (
    USERNAME !== username ||
    PASSWORD !== password
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Invalid credentials." });
  }

  const courierData = {
    courierName,
    courierProvider,
    CODDays,
    status,
  };

  try {
    // Create a new courier entry in the database
    const newCourier = new AllCourier(courierData);
    await newCourier.save();

    return res.status(201).json({
      message: "Courier successfully added.",
      courier: newCourier,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add courier.",
      error: error.message,
    });
  }
};

module.exports = { getAccessToken, saveSmartShip };
