const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  shopName: {type: String , required:true},
  shopSubDomain: { type: String, required: true, unique: true},
  accessToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Shop = mongoose.model('ShopifyShops', ShopSchema);
module.exports = Shop;
