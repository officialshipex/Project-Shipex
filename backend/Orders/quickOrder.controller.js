const quickOrder = require("../model/quickOrder.model");
const jwt = require('jsonwebtoken');
const {quickOrderValidateSchema}= require("../utils/quickOrderValidation");
const createQuickOrder = async (req,res) => {
    try {
        const quickOrderData = req.body;
        
         // Get token from the Authorization header
         const authHeader = req.headers.authorization;
         if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return res.status(401).json({
             success: false,
             message: 'Token not provided or invalid',
           });
         }
         
         const token = authHeader.split(' ')[1]; // Extract the token
         
         // Decode and verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
        //  console.log('Decoded Token:', decoded); 
         // Example: { user: { id: 'userId', email: 'user@example.com' }, iat: ..., exp: ... }
         
         // Use the user's ID from the token to create an order
         const userId = decoded.user.id; // Adjust based on your token payload structure
         
        //  console.log("User ID:",userId);

         // Perform validation
         const { error, value } = quickOrderValidateSchema.validate(quickOrderData, { abortEarly: false }); // `abortEarly: false` to collect all errors
         if (error) {
           console.error('Validation Error:', error.details);
           const validationErrors = error.details.map(err => ({
             field: err.path.join('.'),
             message: err.message
           }));
 
           // Respond with detailed error messages
           return res.status(400).json({
             success: false,
             errors: validationErrors
           });
         }

        const quickOrders = new quickOrder({
          user_Id: decoded.user.id,
          pickupAddress: quickOrderData.pickupAddress,
          buyerDetails: quickOrderData.buyerDetails,
          buyerAddress: quickOrderData.buyerAddress,
          shippingAddress: quickOrderData.shippingAddress || quickOrderData.buyerAddress,  // Default to buyer's address if empty
          productDetails: quickOrderData.productDetails,
          packageDetails: {
            weight: quickOrderData.packageDetails.weight,
            dimensions: quickOrderData.packageDetails.dimensions,
          },
          paymentMethod: quickOrderData.paymentMethod,
        });

        await quickOrders.save();
        
        const responseQuickOrders = ({
          pickupAddress: quickOrders.pickupAddress,
          buyerDetails: quickOrders.buyerDetails,
          buyerAddress: quickOrders.buyerAddress,
          shippingAddress: quickOrders.shippingAddress || quickOrders.buyerAddress,  // Default to buyer's address if empty
          productDetails: quickOrders.productDetails,
          packageDetails: {
            weight: quickOrders.packageDetails.weight,
            dimensions: quickOrders.packageDetails.dimensions,
          },
          paymentMethod: quickOrders.paymentMethod,
          _id:quickOrders.id
        });

        return res.status(201).json({ 
          status:true,
          message: "Order saved successfully" ,
          data:responseQuickOrders
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to save order" });
    }
}

module.exports = {
    createQuickOrder
}