const mongoose = require("mongoose");
const RateCard = require('./rateCards');

const courierServiceSecondSchema = new mongoose.Schema(
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

const CourierServiceSecond= mongoose.model("CourierServicesecond", courierServiceSecondSchema);
module.exports = CourierServiceSecond;