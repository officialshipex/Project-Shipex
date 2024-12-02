const mongoose = require('mongoose');

const dtdcConsignmentSchema = new mongoose.Schema({
    status: String,
    data: Object
});

module.exports = mongoose.model('dtdcConsignment', dtdcConsignmentSchema);