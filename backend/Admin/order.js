const Order=require("../models/newOrder.model")

const getOrdersByStatus = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limitQuery = req.query.limit;
      const limit =
        limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
      const skip = limit ? (page - 1) * limit : 0;
      const status = req.query.status;
  
      const filter = {};
      if (status && status !== "All") {
        filter.status = status;
      }
  
      const totalCount = await Order.countDocuments(filter);
  
      let query = Order.find(filter).sort({ createdAt: -1 });
      if (limit) query = query.skip(skip).limit(limit);
  
      const orders = await query.lean();
      const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
  
      res.json({
        orders,
        totalPages,
        totalCount,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  module.exports={getOrdersByStatus}