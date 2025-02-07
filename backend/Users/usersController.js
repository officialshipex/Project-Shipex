const User = require("../models/User.model");
const Plan =require("../models/Plan.model");
const RateCard=require("../models/rateCards");
const mongoose = require("mongoose");



// const getUsers = async (req, res) => {
//     try {
//         const allUsers = await User.find({});
//         res.status(201).json({
//             success: true,
//             data: allUsers,
//         });
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch users",
//             error: error.message,
//         });
//     }
// };


// In user controller
const getUsers = async (req, res) => {
    try {
        // console.log("hiii")
      const allUsers = await User.find({}); // Get all users
    //   console.log(allUsers)
      res.status(201).json({
        success: true,
        sellers: allUsers.map(user => ({
          id: user._id,
          name: `${user.firstName}`, // Ensure to format the name as needed
        })),
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
    
        const existsingUser=await User.findById(req.user._id).populate('wareHouse').populate({path:'orders',populate:{path:'service_details'}}).populate('Wallet').populate('plan');
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

const assignPlan = async (req, res) => {
    try {
      const { userId, userName, planName, rateCards } = req.body; // Get rateCardName from request body
      
  
      if (!rateCards) {
        return res.status(400).json({ error: 'Rate card name is required' });
      }
  
      // Find the rate card corresponding to the plan
      const rateCard = await RateCard.find({ plan: planName });  // Find rate card by its plan name
    //   console.log(rateCard)
      
  
      // Create a new plan object based on the data received
      const newPlan = new Plan({
        userId,
        userName,
        planName,
        rateCard: rateCard, // Store the entire rate card object here
        assignedAt: new Date(), // Automatically add the timestamp
      });
  
      // Save the plan object to the database
      await newPlan.save();
  
      res.status(201).json({ message: 'Plan assigned successfully', plan: newPlan });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to assign plan' });
    }
  };
  
  
  
  


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
