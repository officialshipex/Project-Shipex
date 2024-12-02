const mongoose = require('mongoose');

// Define the schema for storing pincode information
const dtdcCourierPartnerSchema = new mongoose.Schema({
    orgPincode: { type: String, required: true },
    desPincode: { type: String, required: true },
    responseBody: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Create the model
const dtdcCourierPartner = mongoose.model('dtdcCourierPartners', dtdcCourierPartnerSchema);

module.exports = dtdcCourierPartner;
