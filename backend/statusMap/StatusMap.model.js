// statusMap.model.js
const mongoose = require('mongoose');
const statusMapSchema = new mongoose.Schema({}, { strict: false }); // Allow any key
const StatusMap = mongoose.model('StatusMap', statusMapSchema);
module.exports = StatusMap; // Not exports.StatusMap!
