const mongoose = require("mongoose");

const adminCodRemittance = new mongoose.Schema(
  {
    remitanceAdminData: [
      {
        date: { type: Date },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: {
          type: String,
        },
        remitanceId: {
          type: String,
        },
        totalCod: {
          type: Number,
        },
        earlyCodCharges: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["Pending", "Paid"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true }
);

const CODRemittance = mongoose.model("adminCodRemittance", adminCodRemittance);
module.exports = CODRemittance;
