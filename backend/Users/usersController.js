const User = require("../models/User.model");
const Plan =require("../models/Plan.model");
const RateCard=require("../models/rateCards");


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
    // console.log(req.user._id)
        const existsingUser=await User.findById(req.user._id).populate('wareHouse').populate({path:'orders',populate:{path:'service_details'}}).populate('Wallet').populate('plan');
        // console.log(existsingUser);
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


const getRatecards = async (req, res) => {
    try {
        const { plan: currentPlan } = req.body;

        // Validate input
        if (!currentPlan) {
            return res.status(400).json({
                success: false,
                message: "Plan is required.",
            });
        }

        
        const rateCard = await RateCard.find({ type: currentPlan });

        if (!rateCard || rateCard.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No rate cards found for the specified plan.",
            });
        }
        res.status(201).json({
            success: true,
            message: "Rate cards retrieved successfully.",
            data: rateCard,
        });
    } catch (error) {
        console.error("Error fetching rate cards:", error)
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching rate cards. Please try again later.",
            error: error.message,
        });
    }
};


module.exports = { getUsers,getUserDetails,getAllPlans,assignPlan,getRatecards};
