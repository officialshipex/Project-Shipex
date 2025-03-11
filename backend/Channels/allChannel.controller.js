const { message } = require("../addons/utils/shippingRulesValidation");
const AllChannel = require("./allChannel.model"); // Adjust path if necessary
const axios = require("axios");
const crypto = require("crypto");

const createWebhook = async (sellerShop, accessToken) => {
  try {
    const response = await axios.post(
      `https://${sellerShop}/admin/api/2024-01/webhooks.json`,
      {
        webhook: {
          topic: "orders/create", // Change this based on the event you want to listen to
          address: "https://api.shipexindia.com/v1/channel/getOrders", // Your webhook URL
          format: "json",
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Webhook created:", response.data);
  } catch (error) {
    console.error(
      "Error creating webhook:",
      error.response?.data || error.message
    );
  }
};

const SHOPIFY_SECRET = "92700d39fe6b414bef9bcde36ec3051f"; // Get this from Shopify admin panel

const webhookhandler = async (req, res) => {
  try {
    if (!req.headers || !req.headers["x-shopify-hmac-sha256"]) {
      return res.status(400).send("Missing HMAC header");
    }

    const hmac = req.headers["x-shopify-hmac-sha256"];
    const rawBody =
      req.body instanceof Buffer
        ? req.body
        : Buffer.from(JSON.stringify(req.body));

    const generatedHmac = crypto
      .createHmac("sha256", SHOPIFY_SECRET)
      .update(rawBody)
      .digest("base64");

    if (hmac !== generatedHmac) {
      return res.status(401).send("Unauthorized Webhook");
    }

    console.log("Webhook received:", req.body);
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};

// webhookhandler()

const storeAllChannelDetails = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const userId = req.user._id;

    // Destructure request body
    const {
      channel,
      storeName,
      storeURL,
      storeClientId,
      storeClientSecret,
      storeAccessToken,
      orderSyncFrequency,
      paymentStatusCOD,
      paymentStatusPrepaid,
      multiSeller,
      syncInventory,
      syncDate,
    } = req.body;

    const existingstoreURL = await AllChannel.findOne({ storeURL: storeURL });
    if (existingstoreURL) {
      return res.status(400).json({ message: "StoreURL already exist" });
    }
    // Validate required fields (optional but recommended)
    if (
      !storeName ||
      !storeURL ||
      !storeClientId ||
      !storeClientSecret ||
      !storeAccessToken
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create new channel entry
    const newChannel = new AllChannel({
      userId: userId,
      channel,
      storeName,
      storeURL,
      storeClientId,
      storeClientSecret,
      storeAccessToken,
      orderSyncFrequency,
      paymentStatus: {
        COD: paymentStatusCOD || "",
        Prepaid: paymentStatusPrepaid || "",
      },
      multiSeller,
      syncInventory,
      syncFromDate: syncDate || null,
    });
    createWebhook(storeURL, storeAccessToken);
    // Save to database
    // console.log("hii")
    await newChannel.save();

    return res.status(201).json({
      success: true,
      message: "Channel details stored successfully.",
      data: newChannel,
    });
  } catch (error) {
    console.error("Error storing channel details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const SHOPIFY_STORE = "q22z1q-jn.myshopify.com";
const ACCESS_TOKEN = "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";

const getOrders = async () => {
  try {
    const response = await axios.get(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/orders.json?status=any`,
      {
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// getOrders();

const getAllChannel = async (req, res) => {
  try {
    const allChannels = await AllChannel.find();
    res.status(200).json({ success: true, data: allChannels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getOneChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const channel = await AllChannel.findOne({ _id: id });
    // console.log("channel",channel)

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error("Error fetching channel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateChannel = async (req, res) => {
  const { id } = req.params;
  let updatedData = { ...req.body };

  // Convert syncDate to Date object if provided
  if (req.body.syncDate) {
    updatedData.syncFromDate = new Date(req.body.syncDate);
  }

  try {
    // Check if the channel exists
    const existingChannel = await AllChannel.findById(id);
    if (!existingChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Update the channel details
    const updatedChannel = await AllChannel.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Ensure syncDate is properly formatted
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Channel updated successfully",
      channel: updatedChannel,
    });
  } catch (error) {
    console.error("Error updating channel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteChannel = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the channel
    const deletedChannel = await AllChannel.findByIdAndDelete(id);

    if (!deletedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  storeAllChannelDetails,
  webhookhandler,
  getOrders,
  getAllChannel,
  getOneChannel,
  updateChannel,
  deleteChannel,
};
