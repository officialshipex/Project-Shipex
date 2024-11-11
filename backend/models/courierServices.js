const mongoose = require("mongoose");
const RateCard = require('./rateCards');

const courierServiceSchema = new mongoose.Schema(
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

const CourierService = mongoose.model("CourierService", courierServiceSchema);
module.exports = CourierService;