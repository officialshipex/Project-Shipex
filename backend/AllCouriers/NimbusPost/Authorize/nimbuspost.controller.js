if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
  }
const axios = require('axios');
const Courier = require("../../../models/courierSecond");
const url=process.env.NIMBUSPOST_URL;

const getAuthToken = async () => {
  const payload = {
    email: process.env.NIMBUS_GMAIL,
    password: process.env.NIMBUS_PASS
  };

  try {
    const response = await axios.post(`${url}/v1/users/login`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.data.status) {
      return response.data.data;
    }
    else {
      throw new Error(`Login failed: ${response.data.status}`);
    }
  }
  catch (error) {
    throw new Error(`Error in authentication: ${error.message}`);
  }

}

const saveNimbusPost = async (req, res) => {
  try {
    const existingCourier = await Courier.findOne({ provider: 'NimbusPost' });

    if (existingCourier) {
      return res.status(400).json({ message: 'NimbusPost service is already added' });
    }

    const newCourier = new Courier({
      provider: 'NimbusPost'
    });
    await newCourier.save();
    res.status(201).json({ message: 'NimbusPost Integrated Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error has occurred', error: error.message });
  }
};

const isEnabeled = async (req, res) => {
  try {
    const existingCourier = await Courier.findOne({ provider: 'NimbusPost' });

    if (!existingCourier) {
      return res.status(404).json({ isEnabeled: false, message: "Courier not found" });
    }

    if (existingCourier.isEnabeled && !existingCourier.toEnabeled) {
      return res.status(201).json({ isEnabeled: true, toEnabeled: false });

    } else if (!existingCourier.isEnabeled && existingCourier.toEnabeled) {
      return res.status(201).json({ isEnabeled: false, toEnabeled: true });

    } else if (existingCourier.isEnabeled && existingCourier.toEnabeled) {
      return res.status(201).json({ isEnabeled: true, toEnabeled: true });

    } else {
      return res.status(201).json({ isEnabeled: false, toEnabeled: false });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const enable = async (req, res) => {

  try {
    const existingCourier = await Courier.findOne({ provider: 'NimbusPost' });

    if (!existingCourier) {
      return res.status(404).json({ isEnabeled: false, message: "Courier not found" });
    }

    existingCourier.isEnabeled = true;
    existingCourier.toEnabeled = false;
    const result = await existingCourier.save();
    return res.status(201).json({ isEnabeled: true, toEnabeled: false });
  }
  catch (error) {
    onsole.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

const disable = async (req, res) => {

  try {
    const existingCourier = await Courier.findOne({ provider: 'NimbusPost' });

    if (!existingCourier) {
      return res.status(404).json({ isEnabeled: false, message: "Courier not found" });
    }

    existingCourier.isEnabeled = true;
    existingCourier.toEnabeled = true;
    const result = await existingCourier.save();
    return res.status(201).json({ isEnabeled: true, toEnabeled: true });
  }
  catch (error) {
    onsole.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}



module.exports = { getAuthToken, saveNimbusPost, isEnabeled, disable ,enable};





