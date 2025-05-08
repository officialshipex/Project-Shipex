const mongoose = require("mongoose");

const allocateRoleSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  allocatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AllocatedRole", allocateRoleSchema);