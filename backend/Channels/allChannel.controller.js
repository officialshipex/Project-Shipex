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

// ✅ Webhook Handler (Fixes HMAC Verification)
// const webhookhandler = async (req, res) => {
//   try {
//     console.log("🔔 Webhook Received! Headers:", req.headers);

//     // Shopify sends a raw body, use `req.body` directly
//     if (!req.headers["x-shopify-hmac-sha256"]) {
//       return res.status(400).send("Missing HMAC header");
//     }

//     const hmacHeader = req.headers["x-shopify-hmac-sha256"];
//     const rawBody = req.body; // Already raw due to `express.raw()`

//     const generatedHmac = crypto
//       .createHmac("sha256", SHOPIFY_SECRET)
//       .update(rawBody)
//       .digest("base64");

//     console.log("✅ Received HMAC:", hmacHeader);
//     console.log("✅ Generated HMAC:", generatedHmac);

//     if (hmacHeader !== generatedHmac) {
//       console.error("❌ Webhook HMAC validation failed!");
//       return res.status(401).send("Unauthorized Webhook");
//     }

//     console.log("✅ Webhook Validated! Data:", rawBody.toString());

//     res.status(200).send("Webhook processed successfully");
//   } catch (error) {
//     console.error("❌ Error processing webhook:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

const webhookhandler = async (req, res) => {
  try {
    // console.log("hii");
    // Shopify webhook verification (optional but recommended)
    const hmac = req.headers["x-shopify-shop-domain"];
  
    // const body = JSON.stringify(req.body);
    // const hash = crypto
    //   .createHmac("sha256", process.env.SHOPIFY_SECRET)
    //   .update(body)
    //   .digest("base64");

    // if (hmac !== hash) {
    //   return res.status(401).json({ error: "Unauthorized request" });
    // }

    // const shopifyOrder = req.body; // Incoming order data from Shopify
    console.log("sssssssss",hmac);

    // Extract necessary details and map them to your schema
    const newOrder = new Order({
      userId: shopifyOrder.customer?.id || "Unknown",
      orderId: shopifyOrder.id,
      pickupAddress: {
        contactName: "Shipex Warehouse",
        email: "support@shipexindia.com",
        phoneNumber: "1234567890",
        address: "Warehouse Address",
        pinCode: "110001",
        city: "Delhi",
        state: "Delhi",
      },
      receiverAddress: {
        contactName: shopifyOrder.shipping_address.name,
        email: shopifyOrder.email,
        phoneNumber: shopifyOrder.shipping_address.phone,
        address: shopifyOrder.shipping_address.address1,
        pinCode: shopifyOrder.shipping_address.zip,
        city: shopifyOrder.shipping_address.city,
        state: shopifyOrder.shipping_address.province,
      },
      productDetails: shopifyOrder.line_items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        sku: item.sku,
        unitPrice: item.price,
      })),
      packageDetails: {
        deadWeight: 0.5, // Default, can be updated later
        applicableWeight: 0.5,
        volumetricWeight:{
          length:10,
          width:10,
          height:10
        }
      },
      paymentDetails: {
        method: shopifyOrder.financial_status === "paid" ? "Prepaid" : "COD",
        amount:
          shopifyOrder.financial_status === "paid"
            ? 0
            : shopifyOrder.total_price,
        status: "new",
      },
    });

    await newOrder.save();

    res
      .status(200)
      .json({
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
    console.log("wekdfn", webHook);
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
const getOrders = async (storeURL) => {
  try {
    const user = await AllChannel.findOne({ storeURL });
    // console.log(user)

    if (!user) {
      console.log(`No user found for store: ${storeURL}`);
      return;
    }

    const response = await axios.get(
      `https://${storeURL}/admin/api/2024-01/shop.json`,
      {
        headers: {
          "X-Shopify-Access-Token": user.storeAccessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // const orders = response.data.orders;
    // console.log(orders)
    console.log('Store Name:', response.data.shop.name);


    // for (const order of orders) {
    //   // console.log(`Storing order ${order.id} for user ${user._id}`);
    //   const newOrder = new Order({
    //     userId: user.userId,
    //     orderId: order.id || 123456,
    //     packageDetails:{
    //       deadWeight:1,
    //       applicableWeight:1,
    //       volumetricWeight:{
    //         length:10,
    //         width:10,
    //         height:10
    //       }
    //     },
        // pickupAddress: {
        //   contactName: order.shipping_address.name ||"abc",
        //   email: order.email || "abc",
        //   phoneNumber: order.shipping_address.phone || "abc",
        //   address: order.shipping_address.address1 || "abc",
        //   pinCode: order.shipping_address.zip || "abc",
        //   city: order.shipping_address.city || "abc",
        //   state: order.shipping_address.province || "abc",
        // },
        receiverAddress: {
      //     contactName: order.shipping_address.name ||"abc",
      //     email: order.email || "abc",
      //     phoneNumber: order.shipping_address.phone || "abc",
      //     address: order.shipping_address.address1 || "abc",
      //     pinCode: order.shipping_address.zip || "abc",
      //     city: order.shipping_address.city || "abc",
      //     state: order.shipping_address.province || "abc",
      //   },
      //   productDetails: order.line_items.map((item) => ({
      //     id: item.id || 1,
      //     quantity: item.quantity || 1,
      //     name: item.name || "abc",
      //     sku: item.skum|| "abc",
      //     unitPrice: item.price || "abc",
      //   })),
      //   paymentDetails: {
      //     method: order.financial_status === "paid" ? "Prepaid" : "COD" || "na",
      //     amount: order.financial_status === "paid" ? 0 : order.total_price || 1,
      //     // status: order.financial_status,
      //   },
      //   status:"new"
      // });

      // await newOrder.save();
    }

    console.log("📦 Orders processed successfully!");
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
  }
};


getOrders(SHOPIFY_STORE);


const fulfillOrder = async (orderId, trackingNumber, trackingCompany) => {
  const shopifyStore = "your-store-name";
  const accessToken = "your-access-token";

  try {
    const response = await axios.post(
      `https://${shopifyStore}.myshopify.com/admin/api/2023-04/orders/${orderId}/fulfillments.json`,
      {
        fulfillment: {
          tracking_number: trackingNumber,
          tracking_company: trackingCompany,
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

    console.log("Order Fulfilled:", response.data);
  } catch (error) {
    console.error("Error fulfilling order:", error.response.data);
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
};
