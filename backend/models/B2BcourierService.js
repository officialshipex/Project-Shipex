const mongoose = require("mongoose");
const RateCard = require('./rateCards');

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
    rateCards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RateCard',
    }],
  },
  {
    timestamps: true,
  }
);

const B2BCourierService = mongoose.model("B2BcourierService", B2BcourierServiceSchema);

module.exports = B2BCourierService;
