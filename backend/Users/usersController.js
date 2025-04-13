const User = require("../models/User.model");
const Plan = require("../models/Plan.model");
const mongoose = require("mongoose");
const Account = require("../models/BankAccount.model");
const Aadhar = require("../models/Aadhaar.model");
const Pan = require("../models/Pan.model");
const Gst = require("../models/Gstin.model");
const CodPlans = require("../COD/codPan.model");
const { generateKeySync } = require("crypto");

// const getUsers = async (req, res) => {
//     try {
//         const allUsers = await User.find({});
//         res.status(201).json({
//             success: true,
//             data: allUsers,
//         });
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch users",
//             error: error.message,
//         });
//     }
// };

// In user controller
const getUsers = async (req, res) => {
  try {
      const allUsers = await User.find({ kycDone: true }); 
      const isSeller = allUsers.some(user => user._id.toString() === req.user.id);


      res.status(201).json({
          success: true,
          sellers: allUsers.map(user => ({
              userId: user.userId,
              id:user._id,
              name: `${user.fullname}`,
              
          })),
          isSeller, // Add this field to check if the user is a seller
      });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().populate("Wallet"); // Populate wallet details

    // Fetch user details
    const userDetails = await Promise.all(
      allUsers.map(async (user) => {
        // Fetch additional details for each user
        const account = await Account.findOne({ user: user._id });
        const aadhar = await Aadhar.findOne({ user: user._id });
        const pan = await Pan.findOne({ user: user._id });
        const gst = await Gst.findOne({ user: user._id });
        const codPlan=await CodPlans.findOne({user:user._id})
        const rateCard=await Plan.findOne({userId:user._id})
        return {
          userId: user?.userId || "N/A",
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          company: user.company,
          accountStatus: user.kycDone,
          kycStatus: user.kycDone,
          walletAmount: user.Wallet?.balance || 0,
          creditLimit: user?.creditLimit || 0,
          rateCard: rateCard?.planName || 0,
          codPlan: codPlan ? codPlan.planName : "N/A",
          createdAt: user.createdAt,
          // Account Details
          accountDetails: account
            ? {
                beneficiaryName: account.nameAtBank,
                accountNumber: account.accountNumber,
                ifscCode: account.ifsc,
                bankName: account.bank,
                branchName: account.branch,
              }
            : null,
          // Aadhar Details
          aadharDetails: aadhar
            ? {
                aadharNumber: aadhar.aadhaarNumber,
                nameOnAadhar: aadhar.name,
                state: aadhar.state,
                address: aadhar.address,
              }
            : null,
          // PAN Details
          panDetails: pan
            ? {
                panNumber: pan.panNumber,
                nameOnPan: pan.nameProvided,
                panType: pan.pan,
                referenceId: pan.panRefId,
              }
            : null,
          // GST Details
          gstDetails: gst
            ? {
                gstNumber: gst.gstin,
                companyAddress: gst.address,
                pincode: gst.pincode,
                state: gst.state,
                city: gst.city,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const existsingUser = await User.findById(req.user._id)
      .populate("wareHouse")
      .populate({ path: "orders", populate: { path: "service_details" } })
      .populate("Wallet")
      .populate("plan");
    res.status(201).json({
      success: true,
      user: existsingUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const changeUser = async (req, res) => {
  try {
    console.log("hi");
    const userId = req.user.id; // Assumes you're using JWT auth middleware that sets req.user
    const { adminTab } = req.body;
    console.log("ad",adminTab)

    if (typeof adminTab !== "boolean") {
      return res.status(400).json({ message: "Invalid adminTab value" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { adminTab },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User tab view updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user adminTab:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const allPlans = await Plan.find({});
    res.status(201).json({
      success: true,
      data: allPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
      error: error.message,
    });
  }
};

const assignPlan = async (req, res) => {
  try {
    const { userId, userName, planName, rateCards } = req.body;

    if (!planName || !rateCards) {
      return res
        .status(400)
        .json({ error: "Plan name and rate card are required" });
    }

    console.log(rateCards);

    // Check if there is an existing plan for the user
    let existingPlan = await Plan.findOne({ userId });

    console.log(existingPlan);

    if (existingPlan) {
      // Update existing plan details (both plan name & rate cards)
      existingPlan.planName = planName;
      existingPlan.rateCard = rateCards;
      existingPlan.assignedAt = new Date(); // Update timestamp

      await existingPlan.save();

      return res
        .status(200)
        .json({ message: "Plan updated successfully", plan: existingPlan });
    }

    // If no existing plan, create a new one
    const newPlan = new Plan({
      userId,
      userName,
      planName,
      rateCard: rateCards,
      assignedAt: new Date(),
    });

    await newPlan.save();

    res
      .status(201)
      .json({ message: "Plan assigned successfully", plan: newPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign plan" });
  }
};

const getRatecards = async (req, res) => {
  try {
    const { plan: currentPlan } = req.body;

    // Validate input
    if (!currentPlan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required.",
      });
    }

    const rateCard = await RateCard.find({ type: currentPlan });

    if (!rateCard || rateCard.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rate cards found for the specified plan.",
      });
    }
    res.status(201).json({
      success: true,
      message: "Rate cards retrieved successfully.",
      data: rateCard,
    });
  } catch (error) {
    console.error("Error fetching rate cards:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching rate cards. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserDetails,
  getAllPlans,
  assignPlan,
  getRatecards,
  getAllUsers,
  changeUser,
};
