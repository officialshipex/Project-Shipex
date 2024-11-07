// import mongoose, { mongo } from "mongoose";
const mongoose=require("mongoose")
const {mongo}= require("mongoose")

const courierServiceSchema = new mongoose.Schema(
  {
    courierProvider: {
      type: String,
      required: true,
    },

    courierProviderId: {
      type: String,
      required: true,
    },

    courierProviderServiceName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    courierType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CourierService = mongoose.model("CourierService", courierServiceSchema, "CourierServices");
// export default CourierService;
module.exports=CourierService