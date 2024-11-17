const Order = require('../model/order.model');
const {orderValidateSchema} = require('../utils/orderValidation');
// const { validatePincode,validateEmail, validateName,validatePhoneNumber,validateCompanyName,validateGSTIN } = require('../utils/ordersValidation');

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
          // return res.status(400).json({ success: false, error: error.details });
        

        //  Perform calculations for the order totals
        const totals = calculateOrderTotals(orderData);
        
        const order = new Order({
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
        
        // if(!orderData.buyerDetails.buyerName || !orderData.buyerDetails.phoneNumber || !orderData.buyerDetails.alternatePhoneNumber || !orderData.buyerDetails.email){
        //   return res.status(400).json({
        //     success:false,
        //     message: "Please fill all the Buyers Details fields."
        //   })
        // const buyerDetailsFields = ['buyerName', 'phoneNumber', 'alternatePhoneNumber', 'email'];

        // for (const field of buyerDetailsFields) {
        //     if (!orderData.buyerDetails[field]) {
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
        
        
        // const orderDetailsFields = ['orderId', 'orderType', 'orderDate', 'shippingCharges', 'transaction','additionalDiscount' ,'otherCharges'];
        
        // for (const field of orderDetailsFields) {
        //   if (!orderData.orderDetails[field]) {
        //     return res.status(400).json({
        //       success: false,
        //       message: `Please fill the ${field} field.`
        //     });
        //   }
        // }
        // function validateProductDetails(productDetails) {
        //   for (let i = 0; i < orderData.productDetails.length; i++) {
        //     const product = productDetails[i];
        //     const requiredFields = ['productName', 'quantity', 'unitPrice', 'SKU', 'HSN', 'taxRate', 'productCategory', 'discount'];
            
        //     for (const field of requiredFields) {
        //       if (product[field] === undefined || product[field] === null || product[field] === '') {
        //         return {
        //                   success: false,
        //                   message: `Please fill the ${field} field in product ${i + 1}.`
        //               };
        //           }
        //         }
        //       }
        //       return { success: true }; // All fields are filled in each product
        //     }
            
        //     const validationResult = validateProductDetails(orderData.productDetails);
        //     if (!validationResult.success) {
        //       return res.status(400).json(validationResult);
        //     }
            
        //     if(!orderData.payment.PaymentMethod){
        //       return res.status(400).json({
        //         success:false,
        //         message:"Please fill the PaymentMethod field."
        //     })
        // }
        
        // if(!orderData.packageDetails.weigth){
        //   return res.status(400).json({
        //     success:false,
        //     message:"please fill the weight field."
        //   })
        // }
        
        // // }else if(!orderData.buyerAddress.completeAddress){x`
        // //   return res.status(400).json({
        //   //     success:false,
        //   //     message: "Please fill all the Buyers Address fields."
        //   //   })
        //   // }
        //   if(!validateName(orderData.buyerDetails.buyerName)){
        //     return res.status(400).json({
        //     success: false,
        //     message: "Buyer name must have at least 2 characters and contain only letters."
        //   })
        // }
        
        // // Validate phone number and alternate phone number (must be 10 digits)
        // if (!validatePhoneNumber(orderData.buyerDetails.phoneNumber)) {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Phone number must be 10 digits.'
        //   });
        // }
        
        // if (!validatePhoneNumber(orderData.buyerDetails.alternatePhoneNumber)) {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Alternate phone number must be 10 digits.'
        //   });
        // }
        
        // if(!validateEmail(orderData.buyerDetails.email)){
        //   return res.status(400).json({
        //     success: false,
        //     message: "Please enter a valid Email Address."
        //   })
        // }
        
        // // Validate company name (at least 2 characters, only letters and spaces)
        // if (!validateCompanyName(orderData.buyerAddress.companyName)) {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Company name must contain only letters and spaces, with at least 2 characters.'
        //   });
        // }
        
        // // Validate GSTIN number (generic validation)
        // if (!validateGSTIN(orderData.buyerAddress.gstinNumber)) {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Invalid GSTIN number format.'
        //   });
        // }
        
        // //validate pincode format
        // if(!validatePincode(orderData.buyerAddress.pincode)){
        //   return res.status(400).json({
        //     success:false,
        //     message:"Please enter a valid 6-digit pincode in buyerAddress."
        //   })
        // }
        
        await order.save();
        res.status(201).json({ 
          success:true,
          message: 'Shipment created successfully',
          data: order 
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
        const orders = await Order.find();
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