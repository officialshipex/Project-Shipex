const mongoose = require("mongoose");
const CourierService = require("./courierServices");

const courierSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourierService',
    }],
  },
  {
    timestamps: true,
  }
);

const Courier = mongoose.model("Courier", courierSchema);
module.exports = Courier;