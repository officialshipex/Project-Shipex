const {users}=require('../model/users')

const createUser=async(params)=>{
    console.log("createUser",params);
    
    const data=await users.create({...params})
    console.log("data",data)
    return data
}

const findUser = async(email) => {
    console.log("email",email)
    // const data = await getUserSchema.findOne({email: req.body.email, password: req.body.password});
    const data = await users.find({email});
    return data;
}


const findGoogleUser = async(email,googleOAuthID) => {
    console.log("email",email)
    // const data = await getUserSchema.findOne({email: req.body.email, password: req.body.password});
    const data = await users.findOne({email,googleOAuthID});
    return data;
}
module.exports={createUser,findUser,findGoogleUser}