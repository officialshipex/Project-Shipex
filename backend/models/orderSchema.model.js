const mongoose = require('mongoose');
const User = require("./User.model");

const orderSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    billing_customer_name: {
        type: String,
        required: true
    },
    billing_address: String,
    billing_city: String,
    order_items: {
        type: Array,
        required: true
    },
    sub_total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Shipped', 'Cancelled', 'Fulfilled']
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    isShipped: {
        type: Boolean,
        default: false
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    isFulfilled: {
        type: Boolean,
        default: false
    },
    orderCategory: {
        type: String,
        enum: ['B2C', 'B2B'],
        required: true
    }
}, {
    timestamps: true
});

// Indexing for performance
// orderSchema.index({ order_id: 1, user: 1 });
// orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
