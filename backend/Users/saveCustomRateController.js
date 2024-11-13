const User = require("../models/User.model");
const RateCard = require("../models/rateCards");
const CustomRate = require("../models/CustomRate");

const saveCustomRate = async (req, res) => {
    try {
        let id = req.body.user;
        
        // Find the user by id
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let customPlan;
        if (user.ratecards.length !== 0) {
            customPlan = user.ratecards[0]; // Get the first rate card
        } else {
            customPlan = new CustomRate(); // Create a new custom plan
            user.ratecards.push(customPlan);
            await customPlan.save();
        }

        // Create a new rate card
        let ratecard = await new RateCard({
            courierProviderName: req.body.courierProviderName,
            courierServiceName: req.body.courierServiceName,
            weightPriceBasic: req.body.weightPriceBasic,
            weightPriceAdditional: req.body.weightPriceAdditional,
            codPercent: req.body.codPercent,
            codCharge: req.body.codCharge,
        }).save();

        console.log(ratecard);

        // Add rate card to the custom plan and user
        customPlan.ratecards.push(ratecard._id);
        customPlan.users.push(id);

        // Save custom plan and user
        await customPlan.save();
        await user.save();

        // Send a success response
        res.status(200).send({ message: "Custom rate saved successfully", ratecard });

    } catch (error) {
        console.error("Error saving custom rate:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = { saveCustomRate };




