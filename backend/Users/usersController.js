const User = require("../models/User.model");
const Plan = require("../models/Plan.model");
const mongoose = require("mongoose");
const Account = require("../models/BankAccount.model");
const Aadhar = require("../models/Aadhaar.model");
const Pan = require("../models/Pan.model");
const Gst = require("../models/Gstin.model");
const CodPlans = require("../COD/codPan.model");
const AllocateRole = require("../models/allocateRoleSchema");
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
    let allUsers = [];
    // If employee, filter users by allocations
    if (req.employee && req.employee.employeeId) {
      // Get allocations for this employee
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });
      const sellerMongoIds = allocations.map((a) => a.sellerMongoId);
      // Fetch only users whose _id is in sellerMongoIds
      allUsers = await User.find({
        _id: { $in: sellerMongoIds },
        kycDone: true,
      });
    } else {
      // Admin: get all users as before
      allUsers = await User.find({ kycDone: true });
    }

    const isSeller = allUsers.some(
      (user) => user._id.toString() === req.user?.id
    );

    res.status(201).json({
      success: true,
      sellers: allUsers.map((user) => ({
        userId: user.userId,
        id: user._id,
        name: `${user.fullname}`,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        company: user.company,
        kycStatus: user.kycDone,
        // Add any other fields you want to keep for the frontend
      })),
      isSeller,
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
    const {
      page = 1,
      limit,
      search = "",
      kycStatus,
      rateCard,
      balanceType,
      userId,
    } = req.query;

    console.log("Request query params:", req.query);

    const parsedLimit = limit === "All" || !limit ? null : Number(limit);
    const skip = parsedLimit ? (Number(page) - 1) * parsedLimit : 0;

    const query = {};

    // Exact userId match
    if (userId && userId.trim() !== "") {
      query.userId = userId.trim();
    }
    // Flexible search
    else if (search && search.trim() !== "") {
      const trimmedSearch = search.trim();
      query.$or = [
        { userId: { $regex: trimmedSearch, $options: "i" } },
        { fullname: { $regex: trimmedSearch, $options: "i" } },
        { email: { $regex: trimmedSearch, $options: "i" } },
        { phoneNumber: { $regex: trimmedSearch, $options: "i" } },
      ];
    }

    if (kycStatus === "verified") query.kycDone = true;
    if (kycStatus === "pending") query.kycDone = false;

    const hasFilters =
      (userId && userId.trim() !== "") || (search && search.trim() !== "");

    // Employee-based role filtering
    if (req.employee?.employeeId && !req.employee.isAdmin) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });

      const sellerMongoIds = allocations.map((a) => a.sellerMongoId);

      // Only apply role restriction if there are allocated sellers
      if (sellerMongoIds.length > 0) {
        query._id = { $in: sellerMongoIds };
      } else {
        return res.status(200).json({
          success: true,
          userIds: [],
          userDetails: [],
          verifiedKycCount: 0,
          pendingKycCount: 0,
          currentPage: Number(page),
          totalPages: 0,
          totalCount: 0,
        });
      }
    }

    // Fetch all users based on constructed query
    const users = await User.find(query)
      .populate("Wallet", "balance") // Ensure 'wallet' is correct in schema
      .select(
        "userId fullname email phoneNumber company kycDone creditLimit createdAt"
      )
      .lean();

    console.log("Fetched users:", users.length);

    const userIds = users.map((u) => u._id);

    const [plans, codPlans, accounts, aadhars, pans, gsts] = await Promise.all([
      Plan.find({ userId: { $in: userIds } }).lean(),
      CodPlans.find({ user: { $in: userIds } }).lean(),
      Account.find({ user: { $in: userIds } }).lean(),
      Aadhar.find({ user: { $in: userIds } }).lean(),
      Pan.find({ user: { $in: userIds } }).lean(),
      Gst.find({ user: { $in: userIds } }).lean(),
    ]);

    const planMap = new Map(plans.map((p) => [String(p.userId), p]));
    const codMap = new Map(codPlans.map((p) => [String(p.user), p]));
    const accountMap = new Map(accounts.map((a) => [String(a.user), a]));
    const aadharMap = new Map(aadhars.map((a) => [String(a.user), a]));
    const panMap = new Map(pans.map((p) => [String(p.user), p]));
    const gstMap = new Map(gsts.map((g) => [String(g.user), g]));

    // Filter by wallet balance & rate card if applied
    const filteredUsers = users.filter((user) => {
      const walletBalance = user.wallet?.balance || 0;

      if (balanceType === "positive" && walletBalance < 0) return false;
      if (balanceType === "negative" && walletBalance >= 0) return false;

      const plan = planMap.get(String(user._id));
      if (
        rateCard &&
        plan?.planName?.toLowerCase() !== rateCard.toLowerCase()
      ) {
        return false;
      }

      return true;
    });

    const totalCount = filteredUsers.length;
    const totalPages = parsedLimit ? Math.ceil(totalCount / parsedLimit) : 1;

    const paginatedUsers = parsedLimit
      ? filteredUsers.slice(skip, skip + parsedLimit)
      : filteredUsers;

    const userDetails = paginatedUsers.map((user) => {
      const walletBalance = user.Wallet?.balance || 0;
      const plan = planMap.get(String(user._id));

      return {
        id:user._id,
        userId: user.userId,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        company: user.company,
        kycStatus: user.kycDone,
        walletAmount: walletBalance,
        creditLimit: user.creditLimit || 0,
        rateCard: plan?.planName || "N/A",
        codPlan: codMap.get(String(user._id))?.planName || "N/A",
        createdAt: user.createdAt,
        accountDetails: (() => {
          const acc = accountMap.get(String(user._id));
          if (!acc) return null;
          return {
            beneficiaryName: acc.nameAtBank,
            accountNumber: acc.accountNumber,
            ifscCode: acc.ifsc,
            bankName: acc.bank,
            branchName: acc.branch,
          };
        })(),
        aadharDetails: (() => {
          const a = aadharMap.get(String(user._id));
          if (!a) return null;
          return {
            aadharNumber: a.aadhaarNumber,
            nameOnAadhar: a.name,
            state: a.state,
            address: a.address,
          };
        })(),
        panDetails: (() => {
          const p = panMap.get(String(user._id));
          if (!p) return null;
          return {
            panNumber: p.panNumber,
            nameOnPan: p.nameProvided,
            panType: p.pan,
            referenceId: p.panRefId,
          };
        })(),
        gstDetails: (() => {
          const g = gstMap.get(String(user._id));
          if (!g) return null;
          return {
            gstNumber: g.gstin,
            companyAddress: g.address,
            pincode: g.pincode,
            state: g.state,
            city: g.city,
          };
        })(),
      };
    });

    return res.status(200).json({
      success: true,
      userIds: userDetails.map((u) => u.userId),
      userDetails,
      verifiedKycCount: await User.countDocuments({ ...query, kycDone: true }),
      pendingKycCount: await User.countDocuments({ ...query, kycDone: false }),
      currentPage: Number(page),
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
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
    const userId = req.user
      ? req.user.id
      : req.employee
      ? req.employee.id
      : null;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not found in token" });
    }
    const { adminTab } = req.body;
    console.log("ad", adminTab);

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
