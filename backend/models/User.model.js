const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name : {
//         type : String,
//         required : true,
//     },
//     email : {
//         type : String,
//         required : true,
//         unique : true,
//     },
//     password : {
//         type : String,
//         required : true,
//     }
// });

// const User = mongoose.model.User || mongoose.model('user',userSchema);

// module.exports = User;
const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    company: {
        type: String,
    },
    monthlyOrders: {
        type: String,
    },
    password: {
        type: String,
    },
    googleOAuthID: {
        type: String
    },
    oAuthType: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        default: 'Credentials'
    },
    kycDone:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model.User || mongoose.model('User', usersSchema);

module.exports = User ;
