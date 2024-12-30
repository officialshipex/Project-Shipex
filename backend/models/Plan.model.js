const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  type: {
    type: String,    
    required: true,  
    trim: true 
  }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
