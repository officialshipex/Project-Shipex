const mongoose = require('mongoose');
const Plan = require("../models/Plan.model");
const Warehouse = require("../models/wareHouse.model");
const Order = require("../models/orderSchema.model");
const Wallet = require("./wallet");

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
    wareHouse: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    }],
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    Wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    }
});

usersSchema.pre("save", async function (next) {

    if (this.new) {
        try {
            const wallet = new Wallet({
                balance: 0,
                transactions: [],
            });
            const savedWallet = await wallet.save();
            this.Wallet = savedWallet._id;
            next();
        }
        catch(error){
            next(err); 
        }
    }
    else{
        next(); 
    }
})

// Using existing model if it exists or defining a new one
const User = mongoose.model('User', usersSchema);

module.exports = User;

