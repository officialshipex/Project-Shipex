const Order=require("../models/orderSchema.model");

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


const createOrder = async (req, res) => {
  try {
    console.log("I am in createOrder");
    const data = req.body;

    let newOrder = new Order({
      order_id: data.orderInfo.orderID,
      order_type: data.orderInfo.orderType,
      orderCategory: 'B2C-forward',
      shipping_details: data.shippingInfo,
      Biling_details: data.billingInfo,
      Product_details: data.productDetails,
      shipping_cost: data.shippingCost,
      status: 'Booked',
    });
    let result = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: result });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};




const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find({});
        return res.status(201).json(orders);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = {
    createOrder,
    getAllOrders
}