const mongoose = require('mongoose');

const bulkOrdersFileSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Processing', 'Completed', 'Error'],
        default: 'Processing',
    },
    noOfOrders: {
        type: Number,
        default: 0,
    },
    successfullyUploaded: {
        type: Number,
        default: 0,
    },
    errorOrders: {
        type: Number,
        default: 0,
    },
});

const BulkOrderFiles = mongoose.model('BulkOrderFiles', bulkOrdersFileSchema);
module.exports = BulkOrderFiles;
