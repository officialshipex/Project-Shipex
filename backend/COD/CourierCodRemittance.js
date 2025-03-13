const mongoose = require("mongoose");


const CourierCodRemittanceSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    TotalRemittance:{
        type:Number,
        default:0
    },
    TransferredRemittance:{
        type:Number,
        default:0
    },
    TotalRemittanceDue:{
   type:Number,
   default:0
    },
    CourierCodRemittanceData:[
        {
         orderID:{
            type:String
         },
         userName:{
            type:String
         },
         AwbNumber:{

         },
        CODAmount:{
            type:String
         },
         status: {
            type: String,
            enum: ["Pending", "Paid"],
            default: "Pending",
          },
        }
    ]
})

const CourierCodRemittance = mongoose.model("CourierCodRemittance", CourierCodRemittanceSchema);
module.exports = CourierCodRemittance;