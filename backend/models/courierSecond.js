const mongoose = require("mongoose");
const CourierServiceSecond= require("./courierServiceSecond.model");

const courierSecondSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourierServiceSecond',
    }],
  },
  {
    timestamps: true,
  }
);

const CourierSecond= mongoose.model("CourierSecond", courierSecondSchema);
module.exports = CourierSecond;