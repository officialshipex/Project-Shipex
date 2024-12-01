const mongoose = require('mongoose');

const ZoneMapDataSchema=new mongoose.Schema({
    zone: { type: String, required: true }, 
    distances: {                 
      type: Map,
      of: Number,
      required: true
    }
  
});

const ZoneMapData=mongoose.model('ZoneMapData',ZoneMapDataSchema);
module.exports=ZoneMapData;