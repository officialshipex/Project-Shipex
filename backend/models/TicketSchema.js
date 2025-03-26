const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  awbType: { type: String, enum: ["single", "multiple"], required: true },
  awbNumbers: [{ 
    type: String, 
    required: function () { return this.awbType === "multiple"; } 
  }],
  ticketNumber: { type: String, unique: true, required: true },
  file: { type: String }, // Store file path if uploaded
  createdAt: { type: Date, default: Date.now },

  // User details
  fullname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  company: { type: String, required: true },

  // Status field
  status: { 
    type: String, 
    enum: ["active", "resolved", "deleted"], 
    default: "active" 
  }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
