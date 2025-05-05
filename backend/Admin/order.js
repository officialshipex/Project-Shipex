const Order = require("../models/newOrder.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");

const getOrdersByStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
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
      .populate("userId", "fullname email phoneNumber company userId");

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

const searchUser = async (req, res) => {
  const { query } = req.query;
  console.log("Search query:", query);

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  try {
    const regex = new RegExp(query, "i");
    const conditions = [
      { fullname: regex },
      { email: regex },
      { phoneNumber: regex },
    ];

    // If the query is a number, also search in userId
    if (!isNaN(query)) {
      conditions.push({ userId: Number(query) });
    }

    const users = await User.find({ $or: conditions }).select(
      "fullname email phoneNumber _id userId"
    );

    console.log("Matched users:", users);
    res.json({ users });
  } catch (err) {
    console.error("Error while searching users:", err);
    res.status(500).json({ message: "Error searching users" });
  }
};

const getAllOrdersByNdrStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const status = req.query.status;
    const userId = req.query.userId; // ✅ Accept userId from query if provided

    const filter = {};
    if (status && status !== "All") {
      filter.ndrStatus = status;
    }

    if (userId) {
      filter.userId = userId; // ✅ Optional userId filter
    }

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter)
      .sort({ "ndrReason.date": -1, createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company userId");

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
    console.error("Error fetching NDR orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllOrdersByManualRtoStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const status = req.query.status;
    const userId = req.query.userId; // ✅ Accept userId from query if provided

    const filter = {};
    if (status && status !== "All") {
      filter.manualRTOStatus = status;
    }

    if (userId) {
      filter.userId = userId; // ✅ Optional userId filter
    }

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter)
      .sort({ "ndrReason.date": -1, createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company userId");

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
    console.error("Error fetching NDR orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const filterOrders = async (req, res) => {
  try {
    const {
      orderId,
      status,
      awbNumber,
      date,
      name,
      email,
      contactNumber,
      type,
      courier,
      userId,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (orderId) {
      if (!isNaN(orderId)) {
        filter.orderId = Number(orderId);
      }
    }
    if (status && status !== "All") filter.status = status;
    if (awbNumber) filter.awb_number = { $regex: awbNumber, $options: "i" };
    if (date) {
      // Assuming createdAt is a Date
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    if (type) filter["paymentDetails.method"] = type;
    if (courier) filter.courierServiceName = courier;
    if (userId) {
      filter.userId = mongoose.Types.ObjectId(userId);
    } else if (name || email || contactNumber) {
      // Only run this if userId is NOT set
      let userIds = [];
      const userFilter = {};
      if (name) {
        // If name is a number, search both fullname and phoneNumber
        if (!isNaN(name)) {
          userFilter.$or = [
            { fullname: { $regex: name, $options: "i" } },
            { phoneNumber: { $regex: name, $options: "i" } },
          ];
        } else {
          userFilter.fullname = { $regex: name, $options: "i" };
        }
      }
      if (email) userFilter.email = { $regex: email, $options: "i" };
      if (contactNumber)
        userFilter.phoneNumber = { $regex: contactNumber, $options: "i" };
      console.log("User filter:", userFilter);
      const users = await User.find(userFilter).select("_id");
      console.log("Matched users:", users);
      userIds = users.map((u) => u._id);
      if (userIds.length > 0) filter.userId = { $in: userIds };
      else filter.userId = null; // No match
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalCount = await Order.countDocuments(filter);

    let query = Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company userId");

    query = query.skip(skip).limit(parseInt(limit));

    const orders = await query.lean();
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      orders,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error filtering orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  filterOrders,
  getOrdersByStatus,
  searchUser,
  getAllOrdersByNdrStatus,
  getAllOrdersByManualRtoStatus,
};
