const User = require("../../models/User.model");
const CodRemittance = require("../../COD/codRemittance.model");
const mongoose = require("mongoose");

const getAllCodRemittance = async (req, res) => {
  try {
    const {
      userSearch,
      fromDate,
      toDate,
      status,
      page = 1,
      limit = 20,
      remittanceId,
      utr,
    } = req.query;

    console.log(req.query);

    const userMatchStage = {};
    const remittanceMatchStage = {};

    // Filter by user (ID, email, or name)
    if (userSearch) {
      const regex = new RegExp(userSearch, "i");
      if (mongoose.Types.ObjectId.isValid(userSearch)) {
        userMatchStage["$or"] = [
          { "user._id": new mongoose.Types.ObjectId(userSearch) },
          { "user.email": regex },
          { "user.fullname": regex },
        ];
      } else {
        userMatchStage["$or"] = [
          { "user.email": regex },
          { "user.fullname": regex },
        ];
      }
    }

    // Date filtering
    if (fromDate && toDate) {
      const startDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      const endDate = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      remittanceMatchStage["remittanceData.date"] = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (status) {
      remittanceMatchStage["remittanceData.status"] = status;
    }

    if (remittanceId) {
      remittanceMatchStage["remittanceData.remittanceId"] = remittanceId;
    }

    if (utr) {
      remittanceMatchStage["remittanceData.utr"] = utr;
    }

    const parsedLimit = limit === "all" ? 0 : Number(limit);
    const skip = (Number(page) - 1) * parsedLimit;

    const basePipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: userMatchStage },
      { $unwind: "$remittanceData" },
      { $match: remittanceMatchStage },
      {
        $project: {
          _id: 0,
          user: {
            userId: "$user.userId",
            name: "$user.fullname",
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },
          remittanceId: "$remittanceData.remittanceId",
          date: "$remittanceData.date",
          status: "$remittanceData.status",
          remittanceMethod: "$remittanceData.remittanceMethod",
          utr: "$remittanceData.utr",
          codAvailable: "$remittanceData.codAvailable",
          amountCreditedToWallet: "$remittanceData.amountCreditedToWallet",
          earlyCodCharges: "$remittanceData.earlyCodCharges",
          adjustedAmount: "$remittanceData.adjustedAmount",
          TotalCODRemitted: "$TotalCODRemitted",
          TotalDeductionfromCOD: "$TotalDeductionfromCOD",
        },
      },
      { $sort: { date: -1 } },
    ];

    const [results, totalResult] = await Promise.all([
      parsedLimit === 0
        ? CodRemittance.aggregate(basePipeline)
        : CodRemittance.aggregate([
            ...basePipeline,
            { $skip: skip },
            { $limit: parsedLimit },
          ]),

      CodRemittance.aggregate([...basePipeline, { $count: "total" }]),
    ]);

    const total = totalResult[0]?.total || 0;

    return res.json({
      total,
      page: Number(page),
      limit: parsedLimit === 0 ? "all" : parsedLimit,
      results,
    });
  } catch (error) {
    console.error("Error in getAllCodRemittanceTransactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllCodRemittance };
