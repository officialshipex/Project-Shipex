const mongoose = require('mongoose');

const KycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    businesstype: {
        type: String,
        default: "individual",
        enum: ["individual", "soleProprietor", "company"],
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
    documentVerified: {
        gstin:{
            type: Boolean,
            default: false,
        },
        aadhar: {
            type: Boolean,
            default: false,
        },
        pan: {
            type: Boolean,
            default: false,
        },
        bank: {
            type: Boolean,
            default: false,
        },
    },
}, { timestamps: true });

const Kyc = mongoose.model('Kyc', KycSchema);

module.exports = Kyc;
