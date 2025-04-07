const Order = require("../models/newOrder.model");
const dashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.aggregate([
      { $match: { userId } },
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          deliveredOrders: [
            { $match: { status: "Delivered" } },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$paymentDetails.amount" },
                deliveredCount: { $sum: 1 }
              }
            }
          ],
          shippingOrders: [
            { $match: { status: { $in: ["Delivered", "In-transit", "Ready To Ship"] } } },
            {
              $group: {
                _id: null,
                totalFreight: { $sum: "$totalFreightCharges" },
                shippingCount: { $sum: 1 }
              }
            }
          ],
          pendingOrders: [
            { $match: { status: "new" } },
            { $count: "count" }
          ],
          inTransitOrders: [
            { $match: { status: "In-transit" } },
            { $count: "count" }
          ],
          pendingPickupOrders: [
            { $match: { status: "Ready To Ship" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const data = orders[0];

    const totalorder = data.totalOrders[0]?.count || 0;
    const Delivered = data.deliveredOrders[0]?.deliveredCount || 0;
    const totalRevenue = data.deliveredOrders[0]?.totalRevenue || 0;
    const TotalShipments = data.shippingOrders[0]?.shippingCount || 0;
    const totalFreight = data.shippingOrders[0]?.totalFreight || 0;
    const averageShipping = TotalShipments > 0 ? Math.round(totalFreight / TotalShipments) : 0;
    const pendingOrder = data.pendingOrders[0]?.count || 0;
    const intransite = data.inTransitOrders[0]?.count || 0;
    const pendingdatapickup = data.pendingPickupOrders[0]?.count || 0;

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
    console.error("Dashboard Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  dashboard,
};
