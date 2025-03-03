
const CodPlan = require("./codPan.model"); // Ensure correct model import

const codPlanUpdate = async (req, res) => {
    try {
        const userID = req.user?._id; // Ensure req.user exists
        const { planName, codAmount } = req.body;

        // console.log("Request Body:", req.body); // Debugging log

        // Validate user authentication
        if (!userID) {
            return res.status(401).json({
                success: false,
                error: "User not authenticated",
            });
        }

        // Validate request body
        if (!planName || !codAmount) {
            return res.status(400).json({
                success: false,
                error: "Plan name and COD amount are required",
            });
        }

        // Find existing COD Plan for the user
        let codPlan = await CodPlan.findOne({ user: userID });

        if (codPlan) {
            // Update existing COD Plan
            codPlan.planName = planName;
            codPlan.planCharges = codAmount;
            await codPlan.save();

            return res.status(200).json({
                success: true,
                message: "COD Plan updated successfully",
                codPlan,
            });
        } else {
            // Create new COD Plan
            codPlan = new CodPlan({
                user: userID,
                planName,
                planCharges: codAmount,
            });
            await codPlan.save();

            return res.status(201).json({
                success: true,
                message: "New COD Plan created successfully",
                codPlan,
            });
        }
    } catch (error) {
        console.error("Error updating COD Plan:", error); // Log for debugging

        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the COD Plan",
            error: error.message, // Send error details for debugging (optional)
        });
    }
};
module.exports={
    codPlanUpdate
}