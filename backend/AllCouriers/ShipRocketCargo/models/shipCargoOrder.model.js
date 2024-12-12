const mongoose = require('mongoose');

const shipRocketCargoOrderSchema = new mongoose.Schema({
    orderId: Number,
    fromWarehouseId: Number,
    toWarehouseId: Number,
    mode: String,
    modeId: Number,
    deliveryPartnerName: String,
    deliveryPartnerId: Number,
    transportarId: String
}, { timestamps: true });

const shipCargoOrder =  mongoose.model('shipRocketCargoOrder', shipRocketCargoOrderSchema);
module.exports = shipCargoOrder;