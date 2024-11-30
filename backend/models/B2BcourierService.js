const mongoose = require("mongoose");
const RateCard = require('./rateCards');
const Zone=require("./Zone.model");

const B2BcourierServiceSchema = new mongoose.Schema(
  {
    courierProviderServiceId: {
      type: String,
      required: true,
    },
    courierProviderServiceName: {
      type: String,
      required: true,
    },
    zones:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Zone'
    }]

  },
  {
    timestamps: true,
  }
);

const B2BCourierService = mongoose.model("B2BcourierService", B2BcourierServiceSchema);

module.exports = B2BCourierService;
