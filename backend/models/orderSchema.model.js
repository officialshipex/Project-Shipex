const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  billing_customer_name: String,
  billing_address: String,
  billing_city: String,
  order_items: Array,
  sub_total: Number,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Order", orderSchema);
