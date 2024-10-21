const {users}=require('../model/users')

//create user 
const createUser=async(params)=>{
    const data=await users.create({...params})
    return data
}

//find user/get user
const findUser = async(email) => {
    const data = await users.findOne({email});
    return data;
}

//find user for google
const findGoogleUser = async(email,googleOAuthID) => {
    const data = await users.findOne({email,googleOAuthID});
    return data;
}

module.exports = {
    createUser,
    findUser,
    findGoogleUser
}