const mongoose = require('mongoose');

const bulkOrdersSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BulkOrderFiles',
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerAddress: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    items: [
        {
            itemName: String,
            quantity: Number,
            price: Number,
        },
    ],
    orderTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Shipped', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const bulkOrders = mongoose.model('bulkOrders', bulkOrdersSchema);
module.exports = bulkOrders;
