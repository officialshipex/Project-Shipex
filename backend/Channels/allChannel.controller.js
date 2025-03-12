const { message } = require("../addons/utils/shippingRulesValidation");
const AllChannel = require("./allChannel.model"); // Adjust path if necessary
const axios = require("axios");
const crypto = require("crypto");

// Shopify Credentials (Use Environment Variables Instead)
const SHOPIFY_SECRET = "92700d39fe6b414bef9bcde36ec3051f";
const SHOPIFY_STORE = "q22z1q-jn.myshopify.com";
const ACCESS_TOKEN = "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";

// ✅ Create Webhook Function
const createWebhook = async (sellerShop, accessToken) => {
  try {
    const response = await axios.post(
      `https://${sellerShop}/admin/api/2024-01/webhooks.json`,
      {
        webhook: {
          topic: "orders/create",
          address: "https://api.shipexindia.com/v1/channel/webhook-handler", // ✅ FIXED: Use correct webhook URL
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
    console.log("✅ Webhook created:", response.data);
  } catch (error) {
    console.error(
      "❌ Error creating webhook:",
      error.response?.data || error.message
    );
  }
};

// ✅ Webhook Handler (Fixes HMAC Verification)
const webhookhandler = async (req, res) => {
  try {
    console.log("🔔 Webhook Received! Headers:", req.headers);

    // Shopify sends a raw body, use `req.body` directly
    if (!req.headers["x-shopify-hmac-sha256"]) {
      return res.status(400).send("Missing HMAC header");
    }

    const hmacHeader = req.headers["x-shopify-hmac-sha256"];
    const rawBody = req.body; // Already raw due to `express.raw()`

    const generatedHmac = crypto
      .createHmac("sha256", SHOPIFY_SECRET)
      .update(rawBody)
      .digest("base64");

    console.log("✅ Received HMAC:", hmacHeader);
    console.log("✅ Generated HMAC:", generatedHmac);

    if (hmacHeader !== generatedHmac) {
      console.error("❌ Webhook HMAC validation failed!");
      return res.status(401).send("Unauthorized Webhook");
    }

    console.log("✅ Webhook Validated! Data:", rawBody.toString());

    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Store Channel Details and Register Webhook
const storeAllChannelDetails = async (req, res) => {
  try {
    console.log("📦 Received Store Data:", req.body);
    const userId = req.user?._id;

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

    if (
      !storeName ||
      !storeURL ||
      !storeClientId ||
      !storeClientSecret ||
      !storeAccessToken
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingStore = await AllChannel.findOne({ storeURL });
    if (existingStore) {
      return res.status(400).json({ message: "Store URL already exists" });
    }

    const newChannel = new AllChannel({
      userId,
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

    // ✅ Register Webhook
    await createWebhook(storeURL, storeAccessToken);
    await newChannel.save();

    return res
      .status(201)
      .json({
        success: true,
        message: "Channel details stored successfully.",
        data: newChannel,
      });
  } catch (error) {
    console.error("❌ Error storing channel details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

// ✅ Fetch Orders from Shopify
const getOrders = async (req, res) => {
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
    console.log("📦 Orders Received:", response.data.orders);
    res.status(200).json(response.data.orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
  }
};

// getOrders();

const getAllChannel = async (req, res) => {
  try {
    const userId = req.user._id;
    const allChannels = await AllChannel.find({ userId: userId });
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
