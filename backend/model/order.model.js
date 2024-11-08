const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, require: true },
  quantity: { type: Number, require: true },
  unitPrice: { type: Number, require: true },
  SKU: { type: String },
  HSN: { type: String },
  taxRate: { type: Number },
  productCategory: { type: String},
  discount: { type: Number, default: 0}
});

const addressSchema = new mongoose.Schema({
  addressLine: {
    type: String,
    require: true
  },
  city: {
    type: String,
    require: true
  },
  state: {
    type: String,
    require: true
  },
  country: {
    type: String,
    require: true,
    default: "India"
  },
  pincode: {
    type: String,
    require: true
  },
});

const orderSchema = new mongoose.Schema({
  buyerDetails: {
    buyerName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    alternatePhoneNumber: {
      type: String,
    },
    email: {
      type: String,
      require: true,
    },
  },
  buyerAddress: {
    completeAddress: {
      type: String,
      require: true,
    },
    landmark: {
      type: String,
    },
    pincode: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      default: "India",
    },
    companyName: {
      type: String,
    },
    gstinNumber: {
      type: String,
    },
    billingAddressSameAsShipping: {
      type: Boolean,
      default: false,
    },
  },
  orderDetails: {
    orderId: {
      type: String,
      require: true,
    },
    orderType: {
      type: String,
      require: true,
    },
    orderDate: {
      type: Date,
      require: true,
    },
    shippingCharges: { type:Number },
    giftWrap: { type:Number },
    transaction: { type:Number },
    additionalDiscount: { type:Number },
    subTotal: { type:Number },
    otherCharges: { type:Number },
    totalOrderValue: { type:Number },
  },
  productDetails: [productSchema],
  payment:{
    PaymentMethod:{
        type: String,
        enum: ['COD', 'Prepaid'],
        required: true
      }
  },
  packageDetails: {
    weigth: {
      type: Number,
      require: true,
    },
    volumetricWeigth: {
      type: Number,
      default: 0,
    },
  },
  pickUpAddress: {
    primary: addressSchema,
    additionalAddresses: [addressSchema],
  },
});

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
