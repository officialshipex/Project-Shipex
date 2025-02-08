const mongoose = require("mongoose");
// const { displayName } = require('react-quill');

const receiverAddress = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shipment = mongoose.model("receiverAddress", receiverAddress);

module.exports = Shipment;
