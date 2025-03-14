const { message } = require("../addons/utils/shippingRulesValidation");
const AllChannel = require("./allChannel.model"); // Adjust path if necessary
const axios = require("axios");
const crypto = require("crypto");
const express = require("express");
const app = express();
app.use(express.json());
const Order = require("../models/newOrder.model");

// Shopify Credentials (Use Environment Variables Instead)
const SHOPIFY_SECRET = "92700d39fe6b414bef9bcde36ec3051f";
const SHOPIFY_STORE = "q22z1q-jn.myshopify.com";
const ACCESS_TOKEN = "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";

const createWebhook = async (storeURL, storeAccessToken) => {
  const webhookURL = "https://api.shipexindia.com/v1/channel/webhook/orders";
  const webhookTopic = "orders/create";

  try {
    // Step 1: Fetch existing webhooks
    const existingWebhooksResponse = await axios.get(
      `https://${storeURL}/admin/api/2025-01/webhooks.json`,
      {
        headers: {
          "X-Shopify-Access-Token": storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const existingWebhooks = existingWebhooksResponse.data.webhooks;

    // Step 2: Check if the webhook already exists
    const existingWebhook = existingWebhooks.find(
      (wh) => wh.address === webhookURL && wh.topic === webhookTopic
    );

    if (existingWebhook) {
      console.log("Webhook already exists:", existingWebhook.id);
      return { message: "Webhook already exists", webhook: existingWebhook };
    }

    // Step 3: Create the webhook if it does not exist
    const response = await axios.post(
      `https://${storeURL}/admin/api/2025-01/webhooks.json`,
      {
        webhook: {
          topic: webhookTopic,
          address: webhookURL,
          format: "json",
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Webhook Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating webhook:", error.response?.data || error);
    return { error: error.response?.data || error.message };
  }
};

const getProductDetails = async (productId, storeURL, accessToken) => {
  try {
    const response = await axios.get(
      `https://${storeURL}/admin/api/2024-01/products/${productId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Product Response:", response.data);

    const product = response.data.product;

    // Extract weight from the first variant (assuming single variant per product)
    const weight = product.variants?.[0]?.weight || 1; // Default 0 if not found

    console.log("variants", product.variants);

    return { length: 10, width: 10, height: 10, weight };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { length: 10, width: 10, height: 10, weight: 0 }; // Default values
  }
};

// getProductDetails("6125184188649","q22z1q-jn.myshopify.com","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")

const webhookhandler = async (req, res) => {
  try {
    const storeURL = req.headers["x-shopify-shop-domain"];
    const user = await AllChannel.findOne({ storeURL: storeURL });

    // Fetch store location details
    const location = await axios.get(
      `https://${storeURL}/admin/api/2024-01/locations.json`,
      {
        headers: {
          "X-Shopify-Access-Token": user.storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const locations = location.data.locations[0];

    const shopifyOrder = req.body; // Incoming order data from Shopify
    console.log("reererer", req.body);

    // Extract product details (without weight & dimensions)
    const productDetails = shopifyOrder.line_items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      sku: item.sku,
      unitPrice: item.price,
    }));

    // Fetch package weight & dimensions separately
    let totalWeight = 0;
    let totalLength = 10,
      totalWidth = 10,
      totalHeight = 10;

    for (const item of shopifyOrder.line_items) {
      const productInfo = await getProductDetails(
        item.product_id,
        storeURL,
        user.storeAccessToken
      );

      totalWeight += productInfo.weight;
      totalLength = Math.max(totalLength, productInfo.length);
      totalWidth = Math.max(totalWidth, productInfo.width);
      totalHeight = Math.max(totalHeight, productInfo.height);
    }

    // Create a new order in your database
    const newOrder = new Order({
      userId: user.userId,
      orderId: shopifyOrder.id,
      pickupAddress: {
        contactName: shopifyOrder.billing_address?.name,
        email: shopifyOrder.email,
        phoneNumber: shopifyOrder.billing_address?.phone,
        address: `${shopifyOrder.billing_address?.address1},${shopifyOrder.billing_address?.address2}`,
        pinCode: shopifyOrder.billing_address?.zip,
        city: shopifyOrder.billing_address?.city,
        state: locations?.localized_province_name,
      },
      receiverAddress: {
        contactName: shopifyOrder.shipping_address?.name || "N/A",
        email: shopifyOrder?.email,
        phoneNumber: shopifyOrder.shipping_address?.phone || "0000000000",
        address: shopifyOrder.shipping_address?.address1 || "abc,abc,abc",
        pinCode: shopifyOrder.shipping_address?.zip || "000000",
        city: shopifyOrder.shipping_address?.city || "abc",
        state: shopifyOrder.shipping_address?.province || "abc",
      },
      productDetails, // Now only contains product-related info, no weight or dimensions
      packageDetails: {
        deadWeight: totalWeight, // Total weight of all products
        applicableWeight: totalWeight, // Can be adjusted later if needed
        volumetricWeight: {
          length: totalLength,
          width: totalWidth,
          height: totalHeight,
        },
      },
      paymentDetails: {
        method: shopifyOrder.financial_status === "paid" ? "Prepaid" : "COD",
        amount:
          shopifyOrder.financial_status === "paid"
            ? 0
            : shopifyOrder.total_price,
      },
      status: "new",
    });

    await newOrder.save();

    res.status(200).json({
      message: "Order synced successfully",
      orderId: newOrder.orderId,
    });
  } catch (error) {
    console.error("Error syncing Shopify order:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    // ✅ Register Webhook

    const webHook = await createWebhook(storeURL, storeAccessToken);
    // console.log("✅ Webhook created successfully:", webHook);
    if (webHook.error === "socket hang up") {
      return res
        .status(400)
        .json({
          message: "URL or Token or Secret key or Client ID are not matching",
        });
    }
    // console.log("wekdfn", webHook);
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
      webhookId: webHook.webhook.id,
    });

    await newChannel.save();

    return res.status(201).json({
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
// const axios = require('axios');
// const AllChannel = require('../models/AllChannel'); // Adjust the path accordingly
// const Order = require('../models/Order'); // Adjust the path accordingly

const getOrders = async (storeURL) => {
  try {
    const user = await AllChannel.findOne({ storeURL });

    if (!user) {
      console.log(`No user found for store: ${storeURL}`);
      return;
    }

    const response = await axios.get(
      `https://${storeURL}/admin/api/2024-01/orders.json`,
      {
        headers: {
          "X-Shopify-Access-Token": user.storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const response1 = await axios.get(
      `https://${storeURL}/admin/api/2024-01/locations.json`,
      {
        headers: {
          "X-Shopify-Access-Token": user.storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const locations = response1.data.locations[0];
    console.log("locations", locations);

    // const orders = response.data.orders;
    // console.log(orders)
    console.log("Store Name:", response.data.orders[0].fulfillments);

    console.log("✅ Orders processed successfully!");
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
  }
};

// getOrders(SHOPIFY_STORE);

const fulfillOrder = async (req, res) => {
  let { orderId, provider, waybill } = req.body;

  const userId = req.user._id;
  const channel = await AllChannel.findOne({ userId: userId });
  console.log("chandna", channel);
  if (!channel) {
    return res
      .status(404)
      .json({ message: "Shopify channel not found for this user" });
  }

  const shopifyStore = channel.storeURL;
  const accessToken = channel.storeAccessToken;

  try {
    const response = await axios.post(
      `https://${shopifyStore}/admin/api/2023-04/orders/${orderId}/fulfillments.json`,
      {
        fulfillment: {
          tracking_number: waybill,
          tracking_company: provider,
          notify_customer: true, // Notify customer via email
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Order Fulfilled:", response);
  } catch (error) {
    console.error("Error fulfilling order:", error);
  }
};

// Example Usage
// fulfillOrder("1234567890", "TRK123456", "Ecom Express");

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
  fulfillOrder,
};
