const mongoose = require('mongoose');
const Plan=require("../models/Plan.model");
const Warehouse=require("../models/wareHouse.model");

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    company: {
        type: String,
    },
    monthlyOrders: {
        type: String,
    },
    password: {
        type: String,
    },
    googleOAuthID: {
        type: String
    },
    oAuthType: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        default: 'Credentials'
    },
    kycDone: {
        type: Boolean,
        default: false
    },
    wareHouse:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Warehouse'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
});

// Using existing model if it exists or defining a new one
const User = mongoose.model.User || mongoose.model('User', usersSchema);

module.exports = User;

