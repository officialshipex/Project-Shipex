const User=require("../../models/User.model")
const Wallet=require("../../models/wallet")
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
      orderId
    //   description,
    } = req.query;

    console.log(req.query)

    const userMatchStage = {};
    const transactionMatchStage = {};

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

    if(orderId){
        transactionMatchStage["wallet.transactions.channelOrderId"]=orderId;
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
          category: "$wallet.transactions.category",
          amount: "$wallet.transactions.amount",
          balanceAfterTransaction: "$wallet.transactions.balanceAfterTransaction",
          date: "$wallet.transactions.date",
          awb_number: "$wallet.transactions.awb_number",
          orderId:"$wallet.transactions.channelOrderId",
          description: "$wallet.transactions.description",
        },
      },
      { $sort: { date: -1 } },
    ];

    const [results, totalResult] = await Promise.all([
      parsedLimit === 0
        ? User.aggregate(basePipeline)
        : User.aggregate([...basePipeline, { $skip: skip }, { $limit: parsedLimit }]),

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

module.exports={getAllPassbookTransactions}
