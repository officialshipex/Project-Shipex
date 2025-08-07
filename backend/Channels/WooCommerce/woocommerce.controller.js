const axios = require("axios");
const Order = require("../../models/newOrder.model");
const AllChannel = require("../allChannel.model"); // Adjust path if necessary

const storeURL = "https://www.mahadevrediments.in/";
const consumerKey = "ck_167c49505d20d4ec91bc4bb73459df2c4e7fc489";
const consumerSecret = "cs_e479f1773fc3fc267c0ca01ce1845405d8c5ff66";

// Function to fetch orders from WooCommerce
const fetchWooCommerceOrders = async (
  storeURL,
  consumerKey,
  consumerSecret
) => {
  try {
    const response = await axios.get(`${storeURL}/wp-json/wc/v3/orders`, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    return response.data; // Returns orders from WooCommerce
  } catch (error) {
    console.error(
      "Error fetching WooCommerce orders:",
      error.response?.data || error
    );
    throw new Error("Failed to fetch orders from WooCommerce.");
  }
};
// fetchWooCommerceOrders(storeURL,consumerKey,consumerSecret)
// Payment method mapping
function mapWCPayment(method, methodTitle) {
  if (
    ["COD", "Cash on Delivery", "cash_on_delivery"].includes(method) ||
    /cod/i.test(method) ||
    /cash on delivery/i.test(methodTitle)
  )
    return "COD";
  return "Prepaid";
}

// Validate WooCommerce webhook signature (HMAC SHA256)
function isWooCommerceRequestValid(req) {
  const signature = req.headers["x-wc-webhook-signature"];
  if (!signature || !WOOCOMMERCE_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", WOOCOMMERCE_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body), "utf8")
    .digest("base64");
  return expected === signature;
}
//webhook creation
const checkExistingWooCommerceWebhooks = async (
  storeURL,
  consumerKey,
  consumerSecret
) => {
  try {
    const response = await axios.get(`${storeURL}/wp-json/wc/v3/webhooks`, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    return response.data; // Returns all existing webhooks
  } catch (error) {
    console.error(
      "❌ Error fetching WooCommerce webhooks:",
      error.response?.data || error
    );
    return [];
  }
};

const createWooCommerceWebhook = async (
  storeURL,
  consumerKey,
  consumerSecret
) => {
  try {
    // 🔍 Step 1: Check if a webhook already exists
    const existingWebhooks = await checkExistingWooCommerceWebhooks(
      storeURL,
      consumerKey,
      consumerSecret
    );

    // 🔄 Step 2: Filter Webhooks for our "Order Created" event
    const existingWebhook = existingWebhooks.find(
      (webhook) =>
        webhook.topic.includes("order") &&
        webhook.delivery_url ===
          "https://api.shipexindia.com/v1/channel/webhook/woocommerce"
    );

    if (existingWebhook) {
      console.log("✅ Webhook already exists:", existingWebhook);
      return existingWebhook; // Return existing webhook details
    }

    // 🚀 Step 3: Create new webhook if none exists
    const response = await axios.post(
      `${storeURL}/wp-json/wc/v3/webhooks`,
      {
        name: "Order Created Webhook",
        topic: "order.created",
        delivery_url:
          "https://api.shipexindia.com/v1/channel/webhook/woocommerce",
        status: "active",
      },
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    console.log("✅ Webhook created successfully:", response.data);
    return response.data; // Return newly created webhook details
  } catch (error) {
    console.error(
      "❌ Error creating WooCommerce webhook:",
      error.response?.data || error
    );
    throw new Error("Failed to create WooCommerce webhook.");
  }
};

//webhook handler

const wooCommerceWebhookHandler = async (req, res) => {
  try {
    // Webhook authenticity validation
    // if (!isWooCommerceRequestValid(req)) {
    //   return res.status(401).json({ error: "Invalid WooCommerce signature" });
    // }

    const orderData = req.body;
    console.log("Received WooCommerce Webhook:", orderData);

    // 1. Find WooCommerce store (assume only 1 for now; improve if multiple)
    const store = await AllChannel.findOne({}); // Or use other logic if multi-store

    // 2. Map/find/create user (by email)
    let userId;
    let user = null;
    if (orderData.billing && orderData.billing.email) {
      user = await User.findOne({ email: orderData.billing.email });
      if (!user) {
        // Optionally, create the user if not found:
        user = await User.create({
          email: orderData.billing.email,
          name: [orderData.billing.first_name, orderData.billing.last_name]
            .filter(Boolean)
            .join(" "),
          // ... more fields as needed
        });
      }
      userId = user._id;
    } else {
      return res
        .status(400)
        .json({ error: "No customer email found in WooCommerce order" });
    }

    // 3. Product details + weight/dimensions aggregation
    let totalWeight = 0;
    let totalLength = 10,
      totalWidth = 10,
      totalHeight = 10;
    const productDetails = await Promise.all(
      (orderData.line_items || []).map(async (item) => {
        const productInfo = await getWooCommerceProductDetails(
          item.product_id,
          storeURL,
          consumerKey,
          consumerSecret
        );
        totalWeight += parseFloat(productInfo.weight) * item.quantity || 0;
        totalLength = Math.max(
          totalLength,
          parseFloat(productInfo.length) || 10
        );
        totalWidth = Math.max(totalWidth, parseFloat(productInfo.width) || 10);
        totalHeight = Math.max(
          totalHeight,
          parseFloat(productInfo.height) || 10
        );
        return {
          id: item.id,
          quantity: item.quantity,
          name: item.name,
          sku: item.sku,
          unitPrice: String(item.price), // always string
        };
      })
    );
    const compositeOrderId = `${orderData.customer_id}-${orderData.id}`;

    // 4. Map payment details
    const paymentMethod = mapWCPayment(
      orderData.payment_method,
      orderData.payment_method_title
    );
    // For orders that are not Prepaid, amount can be omitted if your schema is set up as such.
    const paymentDetails = {
      method: paymentMethod,
      ...(paymentMethod === "Prepaid"
        ? { amount: parseFloat(orderData.total) }
        : {}),
    };

    // 5. Prepare order payload
    const orderPayload = {
      userId,
      orderId: orderData.id,
      pickupAddress: {
        contactName: `${orderData.billing.first_name} ${orderData.billing.last_name}`,
        email: orderData.billing.email,
        phoneNumber: orderData.billing.phone,
        address: `${orderData.billing.address_1}, ${orderData.billing.city}`,
        pinCode: orderData.billing.postcode,
        city: orderData.billing.city,
        state: orderData.billing.state,
      },
      receiverAddress: {
        contactName: `${orderData.shipping.first_name} ${orderData.shipping.last_name}`,
        email: orderData.billing.email,
        phoneNumber: orderData.shipping.phone || "0000000000",
        address: orderData.shipping.address_1,
        pinCode: orderData.shipping.postcode,
        city: orderData.shipping.city,
        state: orderData.shipping.state,
      },
      productDetails,
      packageDetails: {
        deadWeight: totalWeight,
        applicableWeight: totalWeight,
        volumetricWeight: {
          length: totalLength,
          width: totalWidth,
          height: totalHeight,
        },
      },
      compositeOrderId,
      paymentDetails,
      status: orderData.status,
    };

    try {
      await Order.create(orderPayload);
      res
        .status(200)
        .json({ message: "WooCommerce order synced successfully." });
    } catch (err) {
      if (err.code === 11000) {
        // duplicate compositeOrderId
        res
          .status(200)
          .json({ message: "Duplicate: WooCommerce order already synced." });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error syncing WooCommerce order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//product details

const getWooCommerceProductDetails = async (
  productId,
  storeURL,
  consumerKey,
  consumerSecret
) => {
  try {
    const response = await axios.get(
      `${storeURL}/wp-json/wc/v3/products/${productId}`,
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    const product = response.data;
    return {
      weight: parseFloat(product.weight) || 0, // ✅ Corrected
      length: parseFloat(product.dimensions.length) || 10,
      width: parseFloat(product.dimensions.width) || 10,
      height: parseFloat(product.dimensions.height) || 10,
    };
  } catch (error) {
    console.error(
      "Error fetching WooCommerce product details:",
      error.response?.data || error
    );
    return { weight: 0, length: 10, width: 10, height: 10 }; // Default values
  }
};

module.exports = { wooCommerceWebhookHandler, createWooCommerceWebhook };
