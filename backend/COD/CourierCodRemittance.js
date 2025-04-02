const mongoose = require("mongoose");

const CourierCodRemittanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  TotalRemittance: {
    type: Number,
    default: 0,
  },
  TransferredRemittance: {
    type: Number,
    default: 0,
  },
  TotalRemittanceDue: {
    type: Number,
    default: 0,
  },
  CourierCodRemittanceData: [
    {
      date: {
        type: Date,
      },
      orderID: {
        type: String,
      },
      userName: {
        type: String,
      },
      PhoneNumber: {
        type: String,
      },
      Email: {
        type: String,
      },
      courierProvider: {
        type: String,
      },
      AwbNumber: {
        type: String,
      },
      CODAmount: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
      },
    },
  ],
});

const CourierCodRemittance = mongoose.model(
  "CourierCodRemittance",
  CourierCodRemittanceSchema
);
module.exports = CourierCodRemittance;
