const jwt = require('jsonwebtoken');
const Order = require('../model/order.model');
const {orderValidateSchema} = require('../utils/orderValidation');

// Utility function to calculate order totals
function calculateOrderTotals(orderData) {
  let subTotal = 0;
  let productDiscount = 0;

  // Calculate sub-total and product discounts
  orderData.productDetails.forEach(product => {
      const { quantity, unitPrice, discount = 0 } = product;
      console.log("quantity:",quantity,"unitprice:",unitPrice,"discount:",discount);
      
      const productTotal = quantity * unitPrice;
      console.log("productTotal:",productTotal);
      
      subTotal += productTotal;
      console.log("subtotal:",subTotal);
      
      productDiscount += (productTotal * discount) / 100;  // Assuming discount is a percentage
      console.log("productDiscount:",productDiscount);
      
    });

  // Calculate other charges
  const shipping = orderData.orderDetails.shippingCharges || 0;
  console.log("shiping:",shipping);
  
  const giftWrap = orderData.orderDetails.giftWrap || 0;  
  console.log("giftwrap:",giftWrap);
  

  // Calculate additional discount on the whole order
  const additionalDiscount = orderData.orderDetails?.additionalDiscount || 0;
  console.log("additionalDiscount:",additionalDiscount);
  
  const discountAmount = (subTotal * additionalDiscount) / 100;
  console.log("discountAmauont:",discountAmount);
  

  // Total order value calculation
  const totalOrderValue = subTotal + shipping + giftWrap - productDiscount - discountAmount;

  return {
      subTotal,
      otherCharges: shipping + giftWrap,  
      discount: productDiscount + discountAmount,
      totalOrderValue
  };
}




const createOrder = async (req,res) => {
  try {
        const orderData = req.body;

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
        console.log('Decoded Token:', decoded); 
        // Example: { user: { id: 'userId', email: 'user@example.com' }, iat: ..., exp: ... }
        
        // Use the user's ID from the token to create an order
        const userId = decoded.user.id; // Adjust based on your token payload structure
        
        console.log("User ID:",userId);
        
        // Perform validation
        const { error, value } = orderValidateSchema.validate(orderData, { abortEarly: false }); // `abortEarly: false` to collect all errors
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

        //  Perform calculations for the order totals
        const totals = calculateOrderTotals(orderData);
        
        const order = new Order({
          user_Id: decoded.user.id,
          buyerDetails:orderData.buyerDetails,
          buyerAddress:orderData.buyerAddress,
          orderDetails:{
            ...orderData.orderDetails,
            subTotal: totals.subTotal,
            otherCharges: totals.otherCharges,
            discount: totals.discount,
            totalOrderValue: totals.totalOrderValue
          
          },
          productDetails:orderData.productDetails,
          payment:orderData.payment,
          packageDetails:orderData.packageDetails,
          pickUpAddress:orderData.pickUpAddress
        });
        console.log("orderDetails:",order.orderDetails);
                
        await order.save();
        
        const responseOrder = {
          buyerDetails: order.buyerDetails, 
          buyerAddress: order.buyerAddress,
          orderDetails: order.orderDetails,
          productDetails: order.productDetails,
          payment: order.payment,
          packageDetails: order.packageDetails,
          pickUpAddress: order.pickUpAddress,
          _id: order._id, // Include order ID in response
        };


        res.status(201).json({ 
          success:true,
          message: 'Shipment created successfully',
          data: responseOrder 
        });
      } catch (error) {
        res.status(400).json({ 
          success:false,
          error: error.message
        });
      }
}


const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find().select('-user_Id');

          // // Exclude userId from all orders in the response
          // const sanitizedOrders = orders.map(order => {
          //   const { userId, ...orderData } = order.toObject(); // Exclude userId
          //   console.log("orderData:",orderData);
            
          //   return orderData;
          // });

        console.log("All orders",orders);
        
        return res.status(200).json(orders);
      } catch (error) {
        res.status(500).json({ error: error.message }); 
      }
}

module.exports = {
    createOrder,
    getAllOrders
}