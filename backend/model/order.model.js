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
  },
  productDetails: [productSchema],
  payment: {
    cod: {
      type: Boolean,
      default: false,
    },
    prepaid: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
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
