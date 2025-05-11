const mongoose = require("mongoose");
const User = require("../../models/User.model");

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
      transactionId
    } = req.query;
    console.log("re", req.query);
    const userMatchStage = {};
    const transactionMatchStage = {};

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
    const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
    const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));

    // Build match conditions
    if (fromDate && toDate) {
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
      transactionMatchStage["wallet.walletHistory.paymentDetails.transactionId"] =
        transactionId;
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
            phoneNumber:"$phoneNumber"
          },
          amount: "$wallet.walletHistory.paymentDetails.amount",
          //   status: "$wallet.walletHistory.paymentDetails.status",
          type: "$wallet.walletHistory.paymentDetails.type",
          date: "$wallet.walletHistory.date",
          //   remark: "$wallet.walletHistory.remark",
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

module.exports = { getAllTransactionHistory };
