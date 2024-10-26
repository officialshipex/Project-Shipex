const axios = require("axios");
const Courier = require("../models/CouriersB2C.model");

// Store the data in database

const saveCourierData = async (
  provider,
  email,
  firstName,
  lastName,
  companyId,
  userId,
  token
) => {
  try {
    const result = await Courier.findOneAndUpdate(
      { provider, userId },
      { email, firstName, lastName, companyId, token, provider, userId },
      { new: true, upsert: true }
    );
    return result;
  } catch (error) {
    throw new Error("Failed to save Credentials in Database:" + error?.message);
  }
};

//  ---------------------------------------> COURIERS <----------------------------------------

// Here We check the credentials is correct if correct we store the data in databse if not Throw error message

const shiprocket = async (req, res) => {
  const { email, password } = req.body;

  try {
    const options = {
      method: "POST",
      url: "https://apiv2.shiprocket.in/v1/external/auth/login",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      data: { email: email, password: password },
    };

    const response = await axios.request(options);
    const data = response.data;

    const saveData = await saveCourierData(
      "shiprocket",
      data.email,
      data.first_name,
      data.last_name,
      data.company_id,
      data.id,
      data.token
    );

    res.status(200).json({
      message: "Email and Pawwrod is correct",
      data: saveData,
      status: response?.status,
    });
  } catch (error) {
    console.log("Please Enter valid Credentials", error);
    res.status(500).json({
      message: "Please Enter valid Credentials.",
      error: error?.message,
    });
  }
};

module.exports = shiprocket;
