const quickOrder = require("../model/quickOrder.model");
const {quickOrderValidateSchema}= require("../utils/quickOrderValidation");
const createQuickOrder = async (req,res) => {
    try {
        const quickOrderData = req.body;
        
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
        
        // if(!quickOrderData.pickupAddress){
        //   return res.status(400).json({
        //     success:false,
        //     message:"Please fill the pickup Address."
        //   })
        // }

        // const buyerDetailsFields = ['buyerName', 'phoneNumber', 'alternatePhoneNumber', 'email'];

        // for (const field of buyerDetailsFields) {
        //     if (!quickOrderData.buyerDetails[field]) {
        //         return res.status(400).json({
        //             success: false,
        //             message: `Please fill the ${field} field.`
        //         });
        //     }
        // }

        // const buyerAddressFields = ['completeAddress', 'landmark', 'pincode', 'city', 'state', 'country','companyName' ,'gstinNumber','billingAddressSameAsShipping'];
        
        // for (const field of buyerAddressFields) {
        //   if (!orderData.buyerAddress[field]) {
        //     return res.status(400).json({
        //       success: false,
        //           message: `Please fill the ${field} field.`
        //       });
        //     }
        // }

        await quickOrders.save();
        return res.status(201).json({ message: "Order saved successfully" ,quickOrders});
    } catch (error) {
        return res.status(500).json({ error: "Failed to save order" });
    }
}

module.exports = {
    createQuickOrder
}