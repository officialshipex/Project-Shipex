const mongoose = require("mongoose");
const B2BcourierService = require("./B2BcourierService");

const B2BcourierSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'B2BcourierService', // Correct reference to B2BcourierService
      }
    ],
  },
  {
    timestamps: true,
  }
);

const B2Bcourier = mongoose.model("B2Bcourier", B2BcourierSchema);

module.exports = B2Bcourier;
