const Wallet = require("../models/wallet");
const User = require("../models/User.model");

require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const FRONTEND_URL = process.env.FRONTEND_URL;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
const createOrder = async (req, res) => {
  try {
    const { amount, walletId } = req.body;

    const options = {
      amount: amount * 100, // in paisa
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
      notes: {
        walletId, // 👈 This will come back in webhook
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Order creation failed", error });
  }
};

// Helper to generate a unique transaction ID
const generateUniqueTransactionId = async () => {
  let transactionId, exists;
  do {
    transactionId =
      Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);
    exists = await Wallet.exists({
      "walletHistory.paymentDetails.transactionId": transactionId,
    });
  } while (exists);
  return transactionId;
};
// Razorpay webhook handler
const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const razorpaySignature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (razorpaySignature !== expectedSignature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  const event = req.body;

  try {
    const payment = event.payload.payment.entity;
    const walletId = payment.notes?.walletId;

    if (!walletId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing walletId" });
    }

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    const alreadyExists = wallet.walletHistory.some(
      (txn) => txn.paymentDetails?.paymentId === payment.id
    );
    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message:
          event.event === "payment.failed"
            ? "Failed payment already logged"
            : "Payment already processed",
      });
    }

    const transactionId = await generateUniqueTransactionId();
    const amount = payment.amount / 100;

    const paymentDetails = {
      paymentId: payment.id,
      orderId: payment.order_id,
      walletId,
      amount,
      transactionId,
    };

    if (event.event === "payment.captured") {
      wallet.balance += amount;

      wallet.walletHistory.push({
        status: "success",
        paymentDetails: {
          ...paymentDetails,
          signature: payment.signature || "",
        },
      });

      await wallet.save();
      return res.status(200).json({
        success: true,
        message: "Payment captured & wallet updated",
      });
    }

    if (event.event === "payment.failed") {
      wallet.walletHistory.push({
        status: "failed",
        paymentDetails: {
          ...paymentDetails,
          description: payment.error_description || "No description provided",
        },
      });

      await wallet.save();
      return res
        .status(200)
        .json({ success: true, message: "Failed payment logged" });
    }

    console.log("Unhandled Razorpay webhook event:", event.event);
    return res
      .status(200)
      .json({ success: true, message: "Unhandled event type" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// const verifyPayment = async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     walletId,
//     amount,
//   } = req.body;

//   const generated_signature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generated_signature === razorpay_signature) {
//     console.log("Payment verified successfully");

//     try {
//       const currentWallet = await Wallet.findById(walletId);

//       if (!currentWallet) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Wallet not found" });
//       }

//       // Update balance
//       currentWallet.balance += amount;
//       // Generate unique 10-digit transactionId
//       let transactionId;
//       let exists = true;

//       while (exists) {
//         transactionId =
//           Date.now().toString().slice(-6) +
//           Math.floor(1000 + Math.random() * 9000);
//         exists = await Wallet.exists({
//           "walletHistory.paymentDetails.transactionId": transactionId,
//         });
//       }

//       // Save detailed walletHistory (only payment info)
//       currentWallet.walletHistory.push({
//         status: "success",
//         paymentDetails: {
//           paymentId: razorpay_payment_id,
//           orderId: razorpay_order_id,
//           signature: razorpay_signature,
//           walletId: walletId,
//           amount: amount,
//           transactionId: transactionId,
//         },
//       });

//       await currentWallet.save();

//       console.log("Wallet updated with payment details");

//       res.json({ success: true, message: "Payment successful" });
//     } catch (err) {
//       console.error("Error processing payment:", err);
//       res.status(500).json({
//         success: false,
//         message: "Server error during payment processing",
//       });
//     }
//   } else {
//     res
//       .status(400)
//       .json({ success: false, message: "Payment verification failed" });
//   }
// };

const getWalletHistoryByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log("user",userId)

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Step 1: Find the user first
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.Wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for this user." });
    }

    // Step 2: Find wallet history using Wallet ID
    const history = await Wallet.find({ _id: user.Wallet }).sort({
      createdAt: -1,
    }); // latest first

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching wallet history",
    });
  }
};

module.exports = { createOrder, razorpayWebhook, getWalletHistoryByUserId };
