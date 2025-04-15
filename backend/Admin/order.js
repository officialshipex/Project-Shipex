const Order=require("../models/newOrder.model")
const User=require("../models/User.model")

const getOrdersByStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit = limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const status = req.query.status;
    const userId = req.query.userId; // ✅ Accept userId from query

    const filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    if (userId) {
      filter.userId = userId; // ✅ Filter by userId if provided
    }

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company");

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

  
  // GET /admin/searchUsers?query=some_text
const searchUser=async (req, res) => {
  const { query } = req.query;

  try {
      const users = await User.find({
          $or: [
              { fullname: new RegExp(query, 'i') },
              { email: new RegExp(query, 'i') },
              { phoneNumber: new RegExp(query, 'i') }
          ]
      }).select("fullname email phoneNumber _id");
      console.log("user",users)

      res.json({ users });
  } catch (err) {
      res.status(500).json({ message: 'Error searching users' });
  }
};


  module.exports={getOrdersByStatus,searchUser}