const Order=require("../models/newOrder.model")
const dashboard = async (req, res) => {
    try {
      const userid = req.user._id;
      const orders = await Order.find({ userId: userid });
      if (!orders || orders.length === 0) {
        return res.status(400).json({ message: "No orders found for this user" });
      }
  
      const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
      );
     
       // Total delivered
      const Delivered = deliveredOrders.length;
      // Total Revenue
      const totalRevenue = deliveredOrders.reduce((total, order) => {
        return total + order.paymentDetails.amount; // Sum up the amount for each delivered order
      }, 0);
      //Average Shipping
     const averageShipping=totalRevenue/Delivered;

     const pending = orders.filter(
        (order) => order.status === "new"
      );
     const pendingOrder=pending.length
     //total order
     const Intransit=orders.filter(
        (order) => order.status === "In Transit"
      );
     const intransite=Intransit.length
      const totalorder = orders.length;
  


   

// console.log(xpreesbees)
      
      return res.status(200).json({
       
        totalorder,
        totalRevenue,
        Delivered,
        averageShipping,
        pendingOrder,
        intransite,
    
      });
    } catch (error) {
      return res.status(400).json({ message: "Order not present" });
    }
  };

  module.exports={
    dashboard
  }