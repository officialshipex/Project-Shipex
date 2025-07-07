const Order = require("../models/newOrder.model");
const { getZone } = require("../Rate/zoneManagementController");
const Cod = require("../COD/codRemittance.model");
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

const getBusinessInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Dates
    const now = new Date();
    const startOfToday = moment().startOf("day").toDate();
    const last30Days = moment().subtract(30, "days").toDate();
    const prev30Days = moment().subtract(60, "days").toDate();

    const startOfWeek = moment().startOf("week").toDate();
    const startOfLastWeek = moment()
      .subtract(1, "weeks")
      .startOf("week")
      .toDate();

    const startOfMonth = moment().startOf("month").toDate();
    const startOfLastMonth = moment()
      .subtract(1, "months")
      .startOf("month")
      .toDate();

    const startOfQuarter = moment().startOf("quarter").toDate();
    const startOfLastQuarter = moment()
      .subtract(1, "quarters")
      .startOf("quarter")
      .toDate();

    const [result] = await Order.aggregate([
      { $match: { userId } },
      {
        $facet: {
          // Today
          todaysOrders: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $count: "count" },
          ],
          todaysRevenue: [
            {
              $match: {
                createdAt: { $gte: startOfToday },
                status: "Delivered",
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],

          // Last 30 days
          last30DaysOrders: [
            { $match: { createdAt: { $gte: last30Days } } },
            { $count: "count" },
          ],
          last30DaysRevenue: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                status: "Delivered",
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],

          // Previous 30 days
          prev30DaysOrders: [
            {
              $match: {
                createdAt: { $gte: prev30Days, $lt: last30Days },
              },
            },
            { $count: "count" },
          ],
          prev30DaysRevenue: [
            {
              $match: {
                createdAt: { $gte: prev30Days, $lt: last30Days },
                status: "Delivered",
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],

          // Week comparisons
          weekOrders: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $count: "count" },
          ],
          lastWeekOrders: [
            {
              $match: {
                createdAt: { $gte: startOfLastWeek, $lt: startOfWeek },
              },
            },
            { $count: "count" },
          ],

          // Month comparisons
          monthOrders: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
          lastMonthOrders: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
              },
            },
            { $count: "count" },
          ],

          // Quarter comparisons
          quarterOrders: [
            { $match: { createdAt: { $gte: startOfQuarter } } },
            { $count: "count" },
          ],
          lastQuarterOrders: [
            {
              $match: {
                createdAt: {
                  $gte: startOfLastQuarter,
                  $lt: startOfQuarter,
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    // Extract results
    const todayOrderCount = result.todaysOrders[0]?.count || 0;
    const todayRevenue = result.todaysRevenue[0]?.revenue || 0;

    const last30Count = result.last30DaysOrders[0]?.count || 0;
    const last30Revenue = result.last30DaysRevenue[0]?.revenue || 0;

    const prev30Count = result.prev30DaysOrders[0]?.count || 0;
    const prev30Revenue = result.prev30DaysRevenue[0]?.revenue || 0;

    const weekCount = result.weekOrders[0]?.count || 0;
    const lastWeekCount = result.lastWeekOrders[0]?.count || 0;

    const monthCount = result.monthOrders[0]?.count || 0;
    const lastMonthCount = result.lastMonthOrders[0]?.count || 0;

    const quarterCount = result.quarterOrders[0]?.count || 0;
    const lastQuarterCount = result.lastQuarterOrders[0]?.count || 0;

    // Calculations
    const avgDailyOrders = Math.round(last30Count / 30);
    const avgOrderValue =
      last30Count > 0 ? Math.round(last30Revenue / last30Count) : 0;

    const growthOrders =
      prev30Count > 0
        ? (((last30Count - prev30Count) / prev30Count) * 100).toFixed(2)
        : "0.00";

    const growthRevenue =
      prev30Revenue > 0
        ? (((last30Revenue - prev30Revenue) / prev30Revenue) * 100).toFixed(2)
        : "0.00";

    const weekGrowth =
      lastWeekCount > 0
        ? (((weekCount - lastWeekCount) / lastWeekCount) * 100).toFixed(2)
        : "0.00";

    const monthGrowth =
      lastMonthCount > 0
        ? (((monthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(2)
        : "0.00";

    const quarterGrowth =
      lastQuarterCount > 0
        ? (
            ((quarterCount - lastQuarterCount) / lastQuarterCount) *
            100
          ).toFixed(2)
        : "0.00";

    // Response
    return res.status(200).json({
      success: true,
      data: {
        todayOrderCount,
        todayRevenue,
        avgDailyOrders,
        avgOrderValue,
        growthOrders,
        growthRevenue,
        statsBreakdown: {
          weekCount,
          weekGrowth,
          monthCount,
          monthGrowth,
          quarterCount,
          quarterGrowth,
        },
      },
    });
  } catch (error) {
    console.error("Business Insights Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = moment().startOf("day").toDate();
    const yesterday = moment().subtract(1, "day").startOf("day").toDate();
    const last30Days = moment().subtract(30, "days").toDate();

    const [result] = await Order.aggregate([
      { $match: { userId } },
      {
        $facet: {
          todaysOrders: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" },
          ],
          yesterdaysOrders: [
            { $match: { createdAt: { $gte: yesterday, $lt: today } } },
            { $count: "count" },
          ],
          todaysRevenue: [
            {
              $match: { createdAt: { $gte: today }, status: "Delivered" },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          yesterdaysRevenue: [
            {
              $match: {
                createdAt: { $gte: yesterday, $lt: today },
                status: "Delivered",
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$paymentDetails.amount" },
              },
            },
          ],
          avgShipping: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                totalFreightCharges: { $gt: 0 },
              },
            },
            {
              $group: {
                _id: null,
                totalFreight: { $sum: "$totalFreightCharges" },
                count: { $sum: 1 },
              },
            },
          ],
          totalShipments: [
            { $match: { createdAt: { $gte: last30Days } } },
            { $count: "count" },
          ],
          readyToShip: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                status: "Ready To Ship",
              },
            },
            { $count: "count" },
          ],
          inTransit: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                status: "In-transit",
              },
            },
            { $count: "count" },
          ],
          outForDelivery: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                status: "Out for Delivery",
              },
            },
            { $count: "count" },
          ],
          delivered: [
            {
              $match: { createdAt: { $gte: last30Days }, status: "Delivered" },
            },
            { $count: "count" },
          ],
          rto: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                status: "RTO Delivered",
              },
            },
            { $count: "count" },
          ],
          totalNdr: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                ndrStatus: { $exists: true },
              },
            },
            { $count: "count" },
          ],
          actionRequired: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                ndrStatus: "Undelivered",
              },
            },
            { $count: "count" },
          ],
          actionRequested: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                ndrStatus: "Action_Requested",
              },
            },
            { $count: "count" },
          ],
          ndrDelivered: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                ndrStatus: "Delivered",
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    // COD values from Cod model
    const codSummary = await Cod.aggregate([
      { $match: { userId } },
      { $unwind: "$remittanceData" },
      {
        $group: {
          _id: null,
          codAvailable: { $sum: "$remittanceData.codAvailable" },
          codTotal: { $sum: "$remittanceData.amountCreditedToWallet" },
          codPending: {
            $sum: {
              $cond: [
                { $eq: ["$remittanceData.status", "Pending"] },
                "$remittanceData.codAvailable",
                0,
              ],
            },
          },
          lastCODRemitted: {
            $max: {
              $cond: [
                { $eq: ["$remittanceData.status", "Paid"] },
                "$remittanceData.date",
                null,
              ],
            },
          },
        },
      },
    ]);

    const codData = codSummary[0] || {};
    const avgShippingData = result.avgShipping[0] || {};
    const avgShippingCost =
      avgShippingData.count > 0
        ? Math.round(avgShippingData.totalFreight / avgShippingData.count)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        // Top Cards
        todaysOrders: result.todaysOrders[0]?.count || 0,
        yesterdaysOrders: result.yesterdaysOrders[0]?.count || 0,
        todaysRevenue: result.todaysRevenue[0]?.revenue || 0,
        yesterdaysRevenue: result.yesterdaysRevenue[0]?.revenue || 0,
        avgShippingCost,

        // COD
        codAvailable: codData.codAvailable || 0,
        codTotal: codData.codTotal || 0,
        codPending: codData.codPending || 0,
        lastCODRemitted: codData.codTotal || 0,
        lastCODRemittedDate: codData.lastCODRemitted || null,

        // Shipment Details
        shipmentStats: {
          total: result.totalShipments[0]?.count || 0,
          readyToShip: result.readyToShip[0]?.count || 0,
          inTransit: result.inTransit[0]?.count || 0,
          outForDelivery: result.outForDelivery[0]?.count || 0,
          delivered: result.delivered[0]?.count || 0,
          rto: result.rto[0]?.count || 0,
        },

        // NDR Details
        ndrStats: {
          totalNdr: result.totalNdr[0]?.count || 0,
          actionRequired: result.actionRequired[0]?.count || 0,
          actionRequested: result.actionRequested[0]?.count || 0,
          ndrDelivered: result.ndrDelivered[0]?.count || 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getOverviewGraphsData = async (req, res) => {
  try {
    const userId = req.user._id;
    const last30Days = moment().subtract(30, "days").toDate();

    const [result] = await Order.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: last30Days },
        },
      },
      {
        $facet: {
          // Apply filter for courier split only
          ordersByProvider: [
            {
              $match: {
                $or: [{ provider: { $ne: null } }, { status: { $ne: "new" } }],
              },
            },
            {
              $group: {
                _id: { $ifNull: ["$provider", "Ecom Express"] },
                value: { $sum: 1 },
              },
            },
            {
              $project: {
                name: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],

          // No filtering here — include all orders
          paymentModeStats: [
            {
              $group: {
                _id: "$paymentDetails.method",
                value: { $sum: 1 },
              },
            },
            {
              $project: {
                name: "$_id",
                value: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        couriersSplit: result.ordersByProvider || [],
        paymentMode: result.paymentModeStats || [],
        deliveryPerformance: result.deliveryPerformanceStats || [],
      },
    });
  } catch (error) {
    console.error("Overview Graphs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch overview graph data",
      error: error.message,
    });
  }
};

const getOverviewCardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfMonth = moment().startOf("month").toDate();
    const startOfWeek = moment().startOf("week").toDate();
    const startOfQuarter = moment().startOf("quarter").toDate();
    const last90Days = moment().subtract(90, "days").toDate();
    const last30Days = moment().subtract(30, "days").toDate();

    const [result] = await Order.aggregate([
      { $match: { userId } },
      {
        $facet: {
          ordersByZone: [
            {
              $match: {
                createdAt: { $gte: last30Days },
              },
            },
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

          last90DaysRevenue: [
            {
              $match: {
                status: "Delivered",
                createdAt: { $gte: last90Days },
              },
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
              $match: {
                status: "Delivered",
                createdAt: { $gte: startOfWeek },
              },
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

          weightSplit: [
            {
              $match: {
                createdAt: { $gte: last30Days },
                userId,
              },
            },
            {
              $project: {
                weight: {
                  $ifNull: [
                    "$packageDetails.applicableWeight",
                    "$packageDetails.deadWeight",
                  ],
                },
              },
            },
            {
              $bucket: {
                groupBy: "$weight",
                boundaries: [0, 0.5, 1, 2, 5, 10, 1000],
                default: "Other",
                output: {
                  count: { $sum: 1 },
                },
              },
            },
            {
              $project: {
                range: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$_id", 0] }, then: "0kg to 0.5kg" },
                      { case: { $eq: ["$_id", 0.5] }, then: "0.5kg to 1kg" },
                      { case: { $eq: ["$_id", 1] }, then: "1kg to 2kg" },
                      { case: { $eq: ["$_id", 2] }, then: "2kg to 5kg" },
                      { case: { $eq: ["$_id", 5] }, then: "5kg to 10kg" },
                      { case: { $eq: ["$_id", 10] }, then: "> 10kg" },
                    ],
                    default: "Other",
                  },
                },
                count: 1,
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    const {
      ordersByZone = [],
      totalOrders = [],
      last90DaysRevenue = [],
      thisMonthRevenue = [],
      thisWeekRevenue = [],
      thisQuarterRevenue = [],
      weightSplit = [],
    } = result;

    const totalOrderCount = totalOrders[0]?.count || 0;

    const ordersByZoneWithPercentage = ordersByZone.map((zone) => {
      const percentage =
        totalOrderCount > 0
          ? ((zone.count / totalOrderCount) * 100).toFixed(2)
          : "0.00";
      return {
        zone: zone.zone,
        percentage: Number(percentage),
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        ordersByZone: ordersByZoneWithPercentage,
        revenueStats: {
          last90Days: last90DaysRevenue[0]?.revenue || 0,
          thisMonth: thisMonthRevenue[0]?.revenue || 0,
          thisWeek: thisWeekRevenue[0]?.revenue || 0,
          thisQuarter: thisQuarterRevenue[0]?.revenue || 0,
        },
        weightSplit: weightSplit, // already has range and count
      },
    });
  } catch (error) {
    console.error("Overview Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard card data",
      error: error.message,
    });
  }
};

module.exports = {
  dashboard,
  getBusinessInsights,
  getDashboardOverview,
  getOverviewGraphsData,
  getOverviewCardData,
};
