const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const AllocateRole = require("../../models/allocateRoleSchema");
const mongoose = require("mongoose");

const getAllPassbookTransactions = async (req, res) => {
  try {
    const {
      userSearch,
      fromDate,
      toDate,
      category,
      page = 1,
      limit = 20,
      awbNumber,
      orderId,
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

    // Filter by user (ID, email, or name)
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

    // Date filtering
    if (fromDate && toDate) {
      const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      transactionMatchStage["wallet.transactions.date"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Filter by category (credit/debit)
    if (category) {
      transactionMatchStage["wallet.transactions.category"] = category;
    }

    if (awbNumber) {
      transactionMatchStage["wallet.transactions.awb_number"] = awbNumber;
    }

    if (orderId) {
      transactionMatchStage["wallet.transactions.channelOrderId"] = orderId;
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
      { $unwind: "$wallet.transactions" },
      { $match: transactionMatchStage },

      // 🔁 Join with neworders based on awb_number
      {
        $lookup: {
          from: "neworders",
          let: { awb: "$wallet.transactions.awb_number" },
          pipeline: [
            { $match: { $expr: { $eq: ["$awb_number", "$$awb"] } } },
            {
              $project: {
                courierServiceName: 1,
                provider: 1,
                _id: 0,
              },
            },
          ],
          as: "orderInfo",
        },
      },

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
          id:"$wallet.transactions._id",
          category: "$wallet.transactions.category",
          amount: "$wallet.transactions.amount",
          balanceAfterTransaction:
            "$wallet.transactions.balanceAfterTransaction",
          date: "$wallet.transactions.date",
          awb_number: "$wallet.transactions.awb_number",
          orderId: "$wallet.transactions.channelOrderId",
          description: "$wallet.transactions.description",
          courierServiceName: {
            $arrayElemAt: ["$orderInfo.courierServiceName", 0],
          },
          provider: { $arrayElemAt: ["$orderInfo.provider", 0] },
        },
      },

      { $sort: { date: -1 } },
    ];

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
    console.error("Error in getAllWalletTransactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const exportPassbook = async (req, res) => {
  try {
    const { transactionsId } = req.body;
    if (!transactionsId || !Array.isArray(transactionsId) || transactionsId.length === 0) {
      return res.status(400).json({ message: "transactionsId array is required" });
    }

    // Convert string IDs to ObjectId
    const objectIds = transactionsId
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    // Aggregate pipeline to fetch transactions matching given ids
    const pipeline = [
      { $match: { Wallet: { $ne: null } } },
      {
        $lookup: {
          from: "wallets",
          localField: "Wallet",
          foreignField: "_id",
          as: "wallet",
        },
      },
      { $unwind: "$wallet" },
      { $unwind: "$wallet.transactions" },
      {
        $match: {
          "wallet.transactions._id": { $in: objectIds },
        },
      },
      {
        $lookup: {
          from: "neworders",
          let: { awb: "$wallet.transactions.awb_number" },
          pipeline: [
            { $match: { $expr: { $eq: ["$awb_number", "$$awb"] } } },
            {
              $project: {
                courierServiceName: 1,
                provider: 1,
                _id: 0,
              },
            },
          ],
          as: "orderInfo",
        },
      },
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
          id: "$wallet.transactions._id",
          category: "$wallet.transactions.category",
          amount: "$wallet.transactions.amount",
          balanceAfterTransaction: "$wallet.transactions.balanceAfterTransaction",
          date: "$wallet.transactions.date",
          awb_number: "$wallet.transactions.awb_number",
          orderId: "$wallet.transactions.channelOrderId",
          description: "$wallet.transactions.description",
          courierServiceName: { $arrayElemAt: ["$orderInfo.courierServiceName", 0] },
          provider: { $arrayElemAt: ["$orderInfo.provider", 0] },
        },
      },
      { $sort: { date: -1 } },
    ];

    const results = await User.aggregate(pipeline);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No transactions found for given IDs" });
    }

    // Build CSV content
    const csvData = results.map((transaction) => ({
      userId: transaction.user.userId,
      userName: transaction.user.name,
      Email: transaction.user.email,
      Category: transaction.category,
      Amount: transaction.amount,
      BalanceAfterTransaction: transaction.balanceAfterTransaction,
      Date: transaction.date.toISOString(),
      AWBNumber: transaction.awb_number || "",
      OrderId: transaction.orderId || "",
      Description: transaction.description || "",
      CourierServiceName: transaction.courierServiceName || "",
      Provider: transaction.provider || "",
    }));

    const csvHeaders = Object.keys(csvData[0]);
    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map((row) => csvHeaders.map((header) => `"${String(row[header]).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=passbook_export.csv");
    return res.send(csvContent);

  } catch (error) {
    console.error("Error exporting passbook by IDs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getAllPassbookTransactions,exportPassbook };
