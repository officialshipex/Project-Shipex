const mongoose = require('mongoose');

const KycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    companyCategory: {
        type: String,
        default: "individual",
        enum: ["individual", "company"],
    },
    companyName: {
        type: String,
    },
    gstNumber: {
        type: String,
        unique: true,
    },
    address: {
        addressLine1: String,
        addressLine2: String,
        pinCode: String,
        city: String,
        state: String,
        country: String,
    },
    kycType: {
        type: String,
        enum: ["digital","manual"]
    },
    aadharNumber: {
        type: String,
        unique: true,
    },
    panNumber: {
        type: String,
        unique: true,
    },
    panName: {
        type: String,
    },
    accountNumber: {
        type: String,
        unique: true,
    },
    ifscCode: {
        type: String,
    },
    accountHolderName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isVerified:{
        type:Boolean
    }
}, { timestamps: true });

const Kyc = mongoose.model('Kyc', KycSchema);

module.exports = Kyc;
