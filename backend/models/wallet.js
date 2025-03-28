const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    channelOrderId:{type: String},
    category: { type: String, enum: ['credit', 'debit'], required: true }, 
    amount: { type: Number, required: true }, 
    balanceAfterTransaction: { type: Number, required: true },
    date: { type: Date, default: Date.now },  
    awb_number:{type:String},
    description:{type:String}
  },
  { timestamps: true }
);


const walletSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 }, 
    transactions: [transactionSchema], 
  },
  { timestamps: true }
);

walletSchema.virtual('currentBalance').get(function () {
  return this.balance;
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
