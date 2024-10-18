const {Schema,model} = require('mongoose');
const bcrypt=require('bcryptjs')
const usersSchema = new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    countryCode:{
        type:String,
        // required:true,
    },
    phoneNumber:{
        type:String,
        // required:true,
    },
    company:{
        type:String,
        // required:true,
    },
    monthlyOrders:{
        type:Number,
    },
    password:{
        type:String,
        //required:true,
    },
    isBuyer:{
        type:Boolean,
        required:true,
    },
    isSeller:{
        type:Boolean,
        required:true,
    },
    googleOAuthID:{
        type: String
    },
    oAuthType:{
        type:Number
    },
    isVerified:{
        type:Boolean
    }
})

const hashPassword = async function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };
  
const validatePassword = async (password, dbPassword) => {
    return bcrypt.compare(password, dbPassword);
  };
const users = model('users',usersSchema); 


module.exports = {users,hashPassword,validatePassword}