
const mongoose=require("mongoose");

const weightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  zoneA: {
    forward: {
      type: Number,
      required: true,
    },
    rto: {
      type: Number,
      required: true,
    }
  },
  zoneB: {
    forward: {
      type: Number,
      required: true,
    },
    rto: {
      type: Number,
      required: true,
    }
  },
  zoneC: {
    forward: {
      type: Number,
      required: true,
    },
    rto: {
      type: Number,
      required: true,
    }
  },
  zoneD: {
    forward: {
      type: Number,
      required: true,
    },
    rto: {
      type: Number,
      required: true,
    }
  },
  zoneE: {
    forward: {
      type: Number,
      required: true,
    },
    rto: {
      type: Number,
      required: true,
    }
  },
});

  const rateCardSchema = new mongoose.Schema({
    courierProviderName:{
      type: String,
      required: true,
    },
    courierServiceName:{
      type: String,
      required: true,
    },
    courierProviderId: {
      type: String,
    },
    courierServiceId: {
      type: String,
    },
    weightPriceBasic: [weightSchema],
    weightPriceAdditional: [weightSchema],
    codPercent: {
      type: Number,
      required: true,
    },
    codCharge: {
      type: Number,
      required: true,
    },
    gst:{
      type:Number,
    },
    defaultRate:{
      type:Boolean,
      default:false
    }
    
  });

const RateCard = mongoose.model("RateCard", rateCardSchema);

module.exports=RateCard;