const mongoose = require("mongoose");
// const { displayName } = require('react-quill');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickupAddress: {
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    displayName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  receiverAddress: {
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    displayName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    zipCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  packageDetails: {
    deadWeight: { type: Number, required: true },
    volumetricWeight: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      calculatedWeight: { type: Number }, // Will store the calculated value
    },
  },
  paymentDetails: {
    method: { type: String, enum: ["COD", "Prepaid"], required: true },
    amount: {
      type: Number,
      required: function () {
        return this.paymentDetails.method === "Prepaid";
      },
    },
  },
  status: {type:String,required:true},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shipment = mongoose.model("newOrder", orderSchema);

module.exports = Shipment;
