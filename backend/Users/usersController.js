const User = require("../models/User.model");
const Plan =require("../models/Plan.model");


const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(201).json({
            success: true,
            data: allUsers,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
    
        const existsingUser=await User.findById(req.user._id).populate('wareHouse').populate({path:'orders',populate:{path:'service_details'}}).populate('Wallet');
        res.status(201).json({
            success: true,
            user:existsingUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const getAllPlans=async(req,res)=>{
    try{
       const allPlans=await Plan.find({});
       res.status(201).json({
        success: true,
        data: allPlans,
    });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to fetch plans",
            error: error.message,
        });
    }
}

const assignPlan=async(req,res)=>{

    try{
    let userId=req.params.userId;
    let planId=req.params.planId;

    const currentUser=await User.findById(userId);
    const currentPlan=await Plan.findById(planId);

    currentUser.plan=currentPlan._id;
    await currentUser.save();
    res.status(201).json({
       success:true,
    });
    }
    catch(error){
        res.status(500).json({
            success:true,
         });
    }
}

module.exports = { getUsers,getUserDetails,getAllPlans,assignPlan};
