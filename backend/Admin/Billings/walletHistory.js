const mongoose = require("mongoose");
const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const AllocateRole = require("../../models/allocateRoleSchema");

const getAllTransactionHistory = async (req, res) => {
  try {
    const {
      userSearch,
      fromDate,
      toDate,
      status,
      page = 1,
      limit = 20,
      paymentId,
      transactionId,
    } = req.query;
    const userMatchStage = {};
    const transactionMatchStage = {};

    // --- Employee filtering logic ---
    let allocatedUserIds = null;
    if (req.employee && req.employee.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });
      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());
      if (allocatedUserIds.length === 0) {
        return res.json({
          total: 0,
          page: Number(page),
          limit: limit === "all" ? "all" : Number(limit),
          results: [],
        });
      }
      userMatchStage["_id"] = {
        $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    // Search by ID, email, or name
    if (userSearch) {
      const regex = new RegExp(userSearch, "i");
      if (mongoose.Types.ObjectId.isValid(userSearch)) {
        userMatchStage["$or"] = [
          { _id: new mongoose.Types.ObjectId(userSearch) },
          { email: regex },
          { name: regex },
        ];
      } else {
        userMatchStage["$or"] = [{ email: regex }, { name: regex }];
      }
    }

    // Normalize dates
    if (fromDate && toDate) {
      const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      transactionMatchStage["wallet.walletHistory.date"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (status) {
      transactionMatchStage["wallet.walletHistory.status"] = status;
    }

    if (paymentId) {
      transactionMatchStage["wallet.walletHistory.paymentDetails.paymentId"] =
        paymentId;
    }

    if (transactionId) {
      transactionMatchStage[
        "wallet.walletHistory.paymentDetails.transactionId"
      ] = transactionId;
    }

    const parsedLimit = limit === "all" ? 0 : Number(limit);
    const skip = (Number(page) - 1) * parsedLimit;

    const basePipeline = [
      { $match: { Wallet: { $ne: null }, ...userMatchStage } },
      {
        $lookup: {
          from: "wallets",
          localField: "Wallet",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      { $unwind: "$wallet.walletHistory" },
      { $match: transactionMatchStage },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$_id",
            name: "$fullname",
            email: "$email",
            userId: "$userId",
            phoneNumber: "$phoneNumber",
          },
          amount: "$wallet.walletHistory.paymentDetails.amount",
          type: "$wallet.walletHistory.paymentDetails.type",
          date: "$wallet.walletHistory.date",
          paymentId: "$wallet.walletHistory.paymentDetails.paymentId",
          orderId: "$wallet.walletHistory.paymentDetails.orderId",
          transactionId: "$wallet.walletHistory.paymentDetails.transactionId",
          status: "$wallet.walletHistory.status",
        },
      },
      { $sort: { date: -1 } },
    ];

    // Execute both paginated results and total count
    const [results, totalResult] = await Promise.all([
      parsedLimit === 0
        ? User.aggregate(basePipeline)
        : User.aggregate([
            ...basePipeline,
            { $skip: skip },
            { $limit: parsedLimit },
          ]),

      User.aggregate([...basePipeline, { $count: "total" }]),
    ]);

    const total = totalResult[0]?.total || 0;

    return res.json({
      total,
      page: Number(page),
      limit: parsedLimit === 0 ? "all" : parsedLimit,
      results,
    });
  } catch (error) {
    console.error("Error in getAllTransactionHistory:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const generateUniqueTransactionId = async () => {
  let transactionId, exists;
  do {
    transactionId =
      Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);

    // Check if any wallet has at least one walletHistory entry with this transactionId
    exists = await Wallet.exists({
      walletHistory: {
        $elemMatch: {
          "paymentDetails.transactionId": transactionId,
        },
      },
    });
  } while (exists);
  console.log("trans", transactionId);
  return transactionId;
};

const addWalletHistory = async (req, res) => {
  try {
    const { userId, paymentId, orderId, amount } = req.body;
    console.log("re", req.body);

    // 1. Validate required fields
    if (!userId || !paymentId || !orderId || amount == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const status = "success"; // Assuming success for this example
    const userID = Number(userId);
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount value" });
    }

    // 2. Find user
    const user = await User.findOne({ userId: userID });
    if (!user || !user.Wallet) {
      return res.status(404).json({ message: "User or Wallet not found" });
    }

    // 3. Fetch wallet
    const wallet = await Wallet.findById(user.Wallet);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // 4. Check if paymentId already exists
    const existingEntry = wallet.walletHistory.find(
      (entry) => entry.paymentDetails.paymentId === paymentId
    );
    if (existingEntry) {
      return res.status(409).json({ message: "Payment ID already exists" });
    }

    // 5. Generate unique 10-digit transactionId
    const transactionId = await generateUniqueTransactionId();

    // 6. Create wallet history entry
    const historyEntry = {
      paymentDetails: {
        paymentId,
        orderId,
        walletId: wallet._id,
        amount: numericAmount,
        transactionId,
      },
      status, // Assuming success for this example
    };

    // 7. Push history
    wallet.walletHistory.push(historyEntry);

    // 8. If successful, update balance and add transaction
    if (status === "success") {
      wallet.balance += numericAmount;

      // wallet.transactions.push({
      //   category: "credit",
      //   amount: Number(amount),
      //   balanceAfterTransaction: wallet.balance,
      //   description: `Credited via Payment ID ${paymentId}`,
      //   channelOrderId: orderId,
      // });
    }

    await wallet.save();

    res.status(200).json({
      message: "Wallet history added successfully",
      transactionId,
      updatedBalance: wallet.balance,
    });
  } catch (err) {
    console.error("Error adding wallet history:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const addPassbook = async (req, res) => {
  try {
    const {
      status,
      orderId,
      awbNumber,
      amount,
      description,
      transactionType,
      userId,
    } = req.body;
    console.log("re", req.body);

    // Validate incoming fields
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    if (!transactionType) {
      return res.status(400).json({ error: "Transaction type is required" });
    }

    if (!["credit", "debit"].includes(transactionType)) {
      return res
        .status(400)
        .json({ error: "Transaction type must be 'credit' or 'debit'" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.Wallet) {
      return res.status(404).json({ error: "User or wallet not found" });
    }

    const walletId = user.Wallet;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Generate unique 10-digit transaction ID
    // const transactionId = generateUniqueTransactionId();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: "Amount must be a valid number" });
    }

    const currentBalance =
      typeof wallet.balance === "number" ? wallet.balance : 0;
      console.log("currentBalance",currentBalance);

    // Calculate new balance
    const newBalance =
  transactionType === "credit"
    ? currentBalance + parsedAmount
    : currentBalance - parsedAmount;
console.log("new balance",newBalance)
    // Add to wallet history
    // wallet.walletHistory.push({
    //   paymentDetails: {
    //     orderId,
    //     description,
    //     walletId,
    //     amount: parseFloat(amount),
    //     transactionId,
    //   },
    //   status: status || "success",
    // });

    // Add to transactions
    wallet.transactions.push({
      channelOrderId: orderId,
      category: transactionType,
      amount: parseFloat(amount),
      balanceAfterTransaction: newBalance,
      awb_number: awbNumber,
      description,
    });

    // Update wallet balance
    wallet.balance = newBalance;

    await wallet.save();

    return res
      .status(200)
      .json({ success: true, message: "Passbook updated successfully" });
  } catch (error) {
    console.error("addPassbook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllTransactionHistory, addWalletHistory, addPassbook };
