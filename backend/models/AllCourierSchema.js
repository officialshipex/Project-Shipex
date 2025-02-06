const mongoose = require('mongoose');

const allCourierSchema = new mongoose.Schema({
    courierName: {
        type: String,
        required: true,
    },
    courierProvider: {
        type: String,
        required: true,
    },
    CODDays: {
        type: Number,
        required: false,
    },
    status: {
        type: Boolean,
        default: true, // Active by default
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const AllCourier = mongoose.models.AllCourier || mongoose.model('allCourier', allCourierSchema);
module.exports = AllCourier;
