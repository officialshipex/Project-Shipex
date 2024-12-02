const mongoose = require('mongoose');

const vasRateSchema = new mongoose.Schema({
  minBillableWeight: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  waybillCharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  cft: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  fuelSurcharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  rovCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  minAwbCharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  fuelToleranceValue: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  freeStoragePeriod: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  demurrageCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  odaCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  
  timeSpecificDeliveryCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  csdDeliveryCharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  mallDeliveriesCharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  deliveryReattemptCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  greenTax: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  handlingCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  podHardCopyCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  rovCarrierRisk: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  chequeHandlingLrCharge: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  toPayCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  codCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  appointmentDeliveryCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  timeBoundDeliveryCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  fmCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  },
  lmCharges: {
    minCharges: { type: Number, required: true },
    maxCharges: { type: Number, required: true },
    fromRange: { type: Number, required: true },
    toRange: { type: Number, required: true }
  }
}, { timestamps: true });

const VASRate = mongoose.model('VASRate', vasRateSchema);

module.exports = VASRate;

