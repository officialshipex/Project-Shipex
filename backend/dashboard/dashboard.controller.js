const Order = require("../models/newOrder.model");
const { getZone } = require("../Rate/zoneManagementController");

const moment = require("moment");

const dashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    // Fetch all shipping orders to determine zones

    // Dates
    const now = new Date();
    const startOfMonth = moment().startOf("month").toDate();
    const startOfWeek = moment().startOf("week").toDate();
    const startOfQuarter = moment().startOf("quarter").toDate();
    const last90Days = moment().subtract(90, "days").toDate();

    const [result] = await Order.aggregate([
      { $match: { userId } },
      {
        $facet: {
          ordersByZone: [
            {
              $group: {
                _id: "$zone",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                zone: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],

          totalOrders: [{ $count: "count" }],
          deliveredStats: [
            { $match: { status: "Delivered" } },
            {
              $group: {
                _id: null,
                deliveredCount: { $sum: 1 },
                totalRevenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          shippingStats: [
            {
              $match: {
                status: {
                  $in: [
                    "Delivered",
                    "In-transit",
                    "Ready To Ship",
                    "Undelivered",
                    "RTO",
                    "RTO In-transit",
                    "Out for Delivery",
                    "RTO Delivered",
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                shippingCount: { $sum: 1 },
                totalFreight: { $sum: "$totalFreightCharges" },
              },
            },
          ],
          pendingOrders: [{ $match: { status: "new" } }, { $count: "count" }],
          inTransitOrders: [
            { $match: { status: "In-transit" } },
            { $count: "count" },
          ],
          readyToShipOrders: [
            { $match: { status: "Ready To Ship" } },
            { $count: "count" },
          ],
          RTOOrders: [
            { $match: { status: "RTO Delivered" } },
            { $count: "count" },
          ],
          ndrOrders: [
            { $match: { ndrStatus: "Undelivered" } },
            { $count: "count" },
          ],
          actionRequestedOrders: [
            { $match: { ndrStatus: "Action_Requested" } },
            { $count: "count" },
          ],
          ndrDeliveredOrders: [
            {
              $match: {
                ndrStatus: "Delivered",
                $expr: { $gt: [{ $size: "$ndrHistory" }, 1] },
              },
            },
            { $count: "count" },
          ],
          ordersByProvider: [
            { $match: { userId } },
            {
              $group: {
                _id: "$provider",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                provider: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],

          // 💰 Revenue Time Ranges
          last90DaysRevenue: [
            {
              $match: { status: "Delivered", createdAt: { $gte: last90Days } },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          thisMonthRevenue: [
            {
              $match: {
                status: "Delivered",
                createdAt: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          thisWeekRevenue: [
            {
              $match: { status: "Delivered", createdAt: { $gte: startOfWeek } },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          thisQuarterRevenue: [
            {
              $match: {
                status: "Delivered",
                createdAt: { $gte: startOfQuarter },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
        },
      },
    ]);

    // Destructure safely
    const {
      totalOrders = [],
      deliveredStats = [],
      shippingStats = [],
      pendingOrders = [],
      inTransitOrders = [],
      readyToShipOrders = [],
      RTOOrders = [],
      ndrOrders = [],
      actionRequestedOrders = [],
      ndrDeliveredOrders = [],
      ordersByProvider = [],
      last90DaysRevenue = [],
      thisMonthRevenue = [],
      thisWeekRevenue = [],
      thisQuarterRevenue = [],
      ordersByZone = [],
    } = result || {};

    const totalOrderCount = totalOrders[0]?.count || 0;
    const deliveredCount = deliveredStats[0]?.deliveredCount || 0;
    const totalRevenue = deliveredStats[0]?.totalRevenue || 0;
    const shippingCount = shippingStats[0]?.shippingCount || 0;
    const totalFreight = shippingStats[0]?.totalFreight || 0;
    const averageShipping =
      shippingCount > 0 ? Math.round(totalFreight / shippingCount) : 0;

    const totalNdr =
      (ndrOrders[0]?.count || 0) +
      (actionRequestedOrders[0]?.count || 0) +
      (ndrDeliveredOrders[0]?.count || 0);
    // console.log("revneue",totalRevenue)

    const ordersByZoneWithPercentage = ordersByZone.map((zone) => {
      const percentage =
        totalOrderCount > 0
          ? ((zone.count / totalOrderCount) * 100).toFixed(2)
          : "0.00";
      return {
        ...zone,
        percentage: Number(percentage), // or keep as string with '%' suffix
      };
    });
    return res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrderCount,
        deliveredOrders: deliveredCount,
        totalRevenue,
        shippingCount,
        totalFreight,
        averageShipping,
        pendingOrders: pendingOrders[0]?.count || 0,
        inTransitOrders: inTransitOrders[0]?.count || 0,
        readyToShipOrders: readyToShipOrders[0]?.count || 0,
        RTOOrders: RTOOrders[0]?.count || 0,
        ndrOrders: ndrOrders[0]?.count || 0,
        actionRequestedOrders: actionRequestedOrders[0]?.count || 0,
        ndrDeliveredOrders: ndrDeliveredOrders[0]?.count || 0,
        totalNdr,
        ordersByProvider,
        revenueStats: {
          last90Days: last90DaysRevenue[0]?.revenue || 0,
          thisMonth: thisMonthRevenue[0]?.revenue || 0,
          thisWeek: thisWeekRevenue[0]?.revenue || 0,
          thisQuarter: thisQuarterRevenue[0]?.revenue || 0,
        },
        ordersByZone: ordersByZoneWithPercentage,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  dashboard,
};
