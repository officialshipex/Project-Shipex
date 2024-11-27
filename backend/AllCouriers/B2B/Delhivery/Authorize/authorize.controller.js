require('dotenv').config({ path: "../../../../.env" });
const axios = require('axios');

const getToken = async () => {
  const url = 'https://ltl-clients-api.delhivery.com/ums/login';
  
  const username = process.env.B2B_DELHIVERY_API;
  const password = process.env.B2B_DELHIVERY_PASSWORD;

  if (!username || !password) {
    console.error("Environment variables for username or password are not set.");
    return { success: false, error: "Environment variables missing" };
  }

  const payload = {
    username,
    password,
  };

  console.log("Payload:", payload);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Login Successful:", response.data.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    if (error.response) {
      console.error("HTTP Error:", error.response.status, error.response.data);
      if (error.response.data.request_id) {
        console.error("Request ID:", error.response.data.request_id);
      }
      return { success: false, error: error.response.data };
    } else {
      console.error("Network or Other Error:", error.message);
      return { success: false, error: error.message };
    }
  }
};


module.exports={getToken};
