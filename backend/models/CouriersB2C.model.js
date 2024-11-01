const mongoose =require("mongoose")

const courierSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ["shiprocket", "nimbuspost" /* add more providers here */],
    },
    courierName:{
      type:String,
      required:true
    },
    companyId: {
      type: Number, // Adjust type based on your needs
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userId: {
      type: Number, // Adjust type based on your needs
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Courier = mongoose.model("Courier", courierSchema, "Couriers");

module.exports=Courier;