const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    trim: true,    
  },
  fullname: {
    type: String,
    required: true, 
    trim: true,     
  },
  cities:[
    {
      type:String,
      trim: true,
    }
  ],
  states:[{
    type:String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});


const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
