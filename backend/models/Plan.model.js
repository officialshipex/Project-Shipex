const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  type: {
    type: String,
  }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
