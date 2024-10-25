const mongoose = require('mongoose');

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
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    company: {
        type: String,
    },
    monthlyOrders: {
        type: Number,
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
    }
});

const User = mongoose.model.User || mongoose.model('User', usersSchema);

module.exports = User ;