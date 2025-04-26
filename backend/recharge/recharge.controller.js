const Wallet = require("../models/wallet");
const User=require("../models/User.model")

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
    const options = {
      amount: req.body.amount * 100, // Amount in paisa
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    // console.log("12345676",order)
    res.json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Order creation failed", error });
  }
};



const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    walletId,
    amount,
    
  } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    console.log("Payment verified successfully");

    try {
      const currentWallet = await Wallet.findById(walletId);

      if (!currentWallet) {
        return res.status(404).json({ success: false, message: "Wallet not found" });
      }

      // Update balance
      currentWallet.balance += amount;

      // Save detailed walletHistory (only payment info)
      currentWallet.walletHistory.push({
        status: "success",
        paymentDetails: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          walletId:walletId,
          amount:amount,

        }
      });

      await currentWallet.save();

      console.log("Wallet updated with payment details");

      res.json({ success: true, message: "Payment successful" });
      
    } catch (err) {
      console.error("Error processing payment:", err);
      res.status(500).json({ success: false, message: "Server error during payment processing" });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

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
      return res.status(404).json({ message: "Wallet not found for this user." });
    }

    // Step 2: Find wallet history using Wallet ID
    const history = await Wallet.find({ _id: user.Wallet })
      .sort({ createdAt: -1 }); // latest first

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


module.exports = { createOrder, verifyPayment,getWalletHistoryByUserId };
