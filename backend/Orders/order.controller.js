const Order = require('../model/order.model');

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
  console.log("I am in createOrder");
  console.log(req.body);
    // try {
    //     const orderData = req.body;

    //     //  Perform calculations for the order totals
    //     const totals = calculateOrderTotals(orderData);

    //     const order = new Order({
    //       buyerDetails:orderData.buyerDetails,
    //       buyerAddress:orderData.buyerAddress,
    //       orderDetails:{
    //         ...orderData.orderDetails,
    //         subTotal: totals.subTotal,
    //         otherCharges: totals.otherCharges,
    //         discount: totals.discount,
    //         totalOrderValue: totals.totalOrderValue
          
    //       },
    //       productDetails:orderData.productDetails,
    //       payment:orderData.payment,
    //       packageDetails:orderData.packageDetails,
    //       pickUpAddress:orderData.pickUpAddress
    //     });
    //     console.log("orderDetails:",order.orderDetails);
        

    //     await order.save();
    //     res.status(201).json({ message: 'Shipment created successfully', order });
    //   } catch (error) {
    //     res.status(400).json({ error: error.message });
    //   }
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