const mongoose = require('mongoose');

const EDDMap = new mongoose.Schema({
  courier: { type: String, required: true },
  serviceName: { type: String, required: true },
  zoneRates: {
    zoneA: { type: Number, required: true },
    zoneB: { type: Number, required: true },
    zoneC: { type: Number, required: true },
    zoneD: { type: Number, required: true },
    zoneE: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('EDDMap', EDDMap);
