const mongoose = require("mongoose");

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

const baseRateCardSchema = new mongoose.Schema({
  courierProviderName: {
    type: String,
    required: true,
  },
  courierServiceName: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  weightPriceBasic: [weightSchema],
  weightPriceAdditional: [weightSchema],
  codCharge: {
    type: Number,
    required: true,
  },
  codPercent: {
    type: Number,
    required: true,
  },
});

// Create the model from the schema
const BaseRateCard = mongoose.model('BaseRateCard', baseRateCardSchema);

module.exports = BaseRateCard;