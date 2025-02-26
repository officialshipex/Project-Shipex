const Order=require("../models/newOrder.model")
const dashboard = async (req, res) => {
    try {
      const userid = req.user._id;
      const orders = await Order.find({ userId: userid });
      if (!orders || orders.length === 0) {
        return res.status(400).json({ message: "No orders found for this user" });
      }
  
      const deliveredOrders = orders.filter(
        (order) => ["Delivered", "new", "In-transit","Ready To Ship"].includes(order.status)
      );

      const Shipments = orders.filter(
        (order) => [ "new","Ready To Ship"].includes(order.status)
      );
      const TotalShipments=Shipments.length
     const Delivereds=deliveredOrders.length
       // Total delivered
       const deliveredOrder = orders.filter(
        (order) => ["Delivered"].includes(order.status)
      );
      const Delivered= deliveredOrder.length;

      // Total Revenue
      const totalRevenue = deliveredOrders.reduce((total, order) => {
        return total + order.paymentDetails.amount; // Sum up the amount for each delivered order
      }, 0);
      //Average Shipping
    //  const averageShipping=totalRevenue/Delivered;
     const averageShipping = Math.round(totalRevenue / Delivereds); // Rounds to the nearest whole number


     const pending = orders.filter(
        (order) => order.status === "new"
      );
     const pendingOrder=pending.length
     //total order
     const Intransit=orders.filter(
        (order) => order.status === "In-transit"
      );
     const intransite=Intransit.length
      const totalorder = orders.length;
  
//pending pickup
const pendingdata=orders.filter(
  (order) => order.status === "Ready To Ship"
);
const pendingdatapickup=pendingdata.length

   

// console.log(xpreesbees)
      
      return res.status(200).json({
       
        totalorder,
        totalRevenue,
        Delivered,
        averageShipping,
        pendingOrder,
        intransite,
        TotalShipments,
        pendingdatapickup
    
      });
    } catch (error) {
      return res.status(400).json({ message: "Order not present" });
    }
  };

  module.exports={
    dashboard
  }