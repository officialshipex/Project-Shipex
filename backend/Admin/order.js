const Order = require("../models/newOrder.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const AllocateRole = require("../models/allocateRoleSchema");

const filterOrdersForEmployee = async (req, res) => {
  try {
    const {
      orderId,
      status,
      awbNumber,
      startDate,
      endDate,
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

    // Apply order-level filters
    if (orderId && !isNaN(orderId)) {
      filter.orderId = Number(orderId);
    }

    if (status && status !== "All") filter.status = status;
    if (awbNumber) filter.awb_number = { $regex: awbNumber, $options: "i" };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    if (type) filter["paymentDetails.method"] = type;
    if (courier) filter.courierServiceName = courier;

    let allocatedUserIds = [];

    // If the requester is an employee, restrict orders to only their allocations
    if (req.employee && req.employee.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });

      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());

      if (allocatedUserIds.length === 0) {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: parseInt(page),
        });
      }

      // Apply userId or name/email/phone filters for employees
      if (userId) {
        const userObjId = new mongoose.Types.ObjectId(userId);
        if (allocatedUserIds.includes(userObjId.toString())) {
          filter.userId = userObjId;
        } else {
          return res.json({
            orders: [],
            totalPages: 0,
            totalCount: 0,
            currentPage: parseInt(page),
          });
        }
      } else if (name || email || contactNumber) {
        const userFilter = {};
        if (name) {
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
        if (contactNumber) userFilter.phoneNumber = { $regex: contactNumber, $options: "i" };

        const matchedUsers = await User.find(userFilter).select("_id");
        const matchedIds = matchedUsers.map((u) => u._id.toString());

        const validUserIds = matchedIds.filter((id) =>
          allocatedUserIds.includes(id)
        );

        if (validUserIds.length > 0) {
          filter.userId = {
            $in: validUserIds.map((id) => new mongoose.Types.ObjectId(id)),
          };
        } else {
          return res.json({
            orders: [],
            totalPages: 0,
            totalCount: 0,
            currentPage: parseInt(page),
          });
        }
      } else {
        // Default to all allocated users
        filter.userId = {
          $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }
    } else {
      // If not employee, apply filters without user allocation restriction
      if (userId) {
        filter.userId = new mongoose.Types.ObjectId(userId);
      } else if (name || email || contactNumber) {
        const userFilter = {};
        if (name) {
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
        if (contactNumber) userFilter.phoneNumber = { $regex: contactNumber, $options: "i" };

        const matchedUsers = await User.find(userFilter).select("_id");
        const matchedIds = matchedUsers.map((u) => u._id);
        filter.userId = { $in: matchedIds };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company userId")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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

const filterNdrOrdersForEmployee = async (req, res) => {
  try {
    const {
      orderId,
      awbNumber,
      ndrStatus,
      status,
      courier,
      startDate,
      endDate,
      name,
      email,
      contactNumber,
      userId,
      paymentType,
      page = 1,
      limit = 20,
    } = req.query;

    console.log(req.query);

    const filter = {};

    if (orderId) {
      if (!isNaN(orderId)) {
        filter.orderId = Number(orderId);
      } else {
        filter.orderId = { $regex: orderId, $options: "i" };
      }
    }

    if (awbNumber) filter.awb_number = { $regex: awbNumber, $options: "i" };
    if (paymentType) filter["paymentDetails.method"] = paymentType;
    if (ndrStatus && ndrStatus !== "All") filter.ndrStatus = ndrStatus;
    if (status && status !== "All") filter.status = status;
    if (courier) filter.courierServiceName = courier;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    // Check if employee
    let allocatedUserIds = null;
    if (req.employee && req.employee.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });

      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());

      if (allocatedUserIds.length === 0) {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: parseInt(page),
        });
      }
    }

    if (userId) {
      const userObjId = new mongoose.Types.ObjectId(userId);
      if (
        allocatedUserIds &&
        !allocatedUserIds.includes(userObjId.toString())
      ) {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: parseInt(page),
        });
      }
      filter.userId = userObjId;
    } else if (name || email || contactNumber) {
      const userFilter = {};
      if (name) userFilter.fullname = { $regex: name, $options: "i" };
      if (email) userFilter.email = { $regex: email, $options: "i" };
      if (contactNumber) userFilter.phoneNumber = { $regex: contactNumber, $options: "i" };

      const users = await User.find(userFilter).select("_id");
      const matchedIds = users.map((u) => u._id.toString());

      let validUserIds = matchedIds;
      if (allocatedUserIds) {
        validUserIds = matchedIds.filter((id) => allocatedUserIds.includes(id));
      }

      if (validUserIds.length > 0) {
        filter.userId = {
          $in: validUserIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
      } else {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: parseInt(page),
        });
      }
    } else if (allocatedUserIds) {
      // If no user filters but employee is present, use all allocated user IDs
      filter.userId = {
        $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullname email phoneNumber company userId")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      orders,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error filtering employee NDR orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAllOrdersByManualRtoStatusForEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const status = req.query.status;
    const userId = req.query.userId;

    const filter = {};
    if (status && status !== "All") {
      filter.manualRTOStatus = status;
    }

    // Check if employee context
    let allocatedUserIds = null;
    if (req.employee && req.employee.employeeId) {
      const allocations = await AllocateRole.find({
        employeeId: req.employee.employeeId,
      });

      allocatedUserIds = allocations.map((a) => a.sellerMongoId.toString());

      if (allocatedUserIds.length === 0) {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: page,
        });
      }
    }

    if (userId) {
      const userObjId = new mongoose.Types.ObjectId(userId);
      if (
        allocatedUserIds &&
        !allocatedUserIds.includes(userObjId.toString())
      ) {
        return res.json({
          orders: [],
          totalPages: 0,
          totalCount: 0,
          currentPage: page,
        });
      }
      filter.userId = userObjId;
    } else if (allocatedUserIds) {
      // Apply allocation filter only if employee context and no specific userId
      filter.userId = {
        $in: allocatedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
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
    console.error("Error fetching Manual RTO orders (Employee):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const getOrdersByStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitQuery = req.query.limit;
    const limit =
      limitQuery === "All" || !limitQuery ? null : parseInt(limitQuery);
    const skip = limit ? (page - 1) * limit : 0;

    const status = req.query.status;
    const userId = req.query.userId; // ✅ Accept userId from query
    console.log(userId)

    const filter = {};
    if (status && status !== "All") {
      filter.status = status;
    }

    if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId);
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
  // console.log("Search query:", query);

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

    // console.log("Matched users:", users);
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
      filter.userId = new mongoose.Types.ObjectId(userId);
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
      filter.userId = new mongoose.Types.ObjectId(userId);
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
      startDate,
      endDate,
      name,
      email,
      contactNumber,
      type,
      courier,
      userId,
      page = 1,
      limit = 20,
    } = req.query;
    // console.log(startDate, endDate);

    const filter = {};

    if (orderId) {
      if (!isNaN(orderId)) {
        filter.orderId = Number(orderId);
      }
    }
    if (status && status !== "All") filter.status = status;
    if (awbNumber) filter.awb_number = { $regex: awbNumber, $options: "i" };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include full end day
    
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }
    
    
    if (type) filter["paymentDetails.method"] = type;
    if (courier) filter.courierServiceName = courier;
    if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId);
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



const filterNdrOrders = async (req, res) => {
  try {
    const {
      orderId,
      awbNumber,
      ndrStatus,
      status,
      courier,
      startDate,
      endDate,
      name,
      email,
      contactNumber,
      userId,
      paymentType,
      page = 1,
      limit = 20,
    } = req.query;

    console.log(startDate, endDate);

    const filter = {};

    if (orderId) {
      if (!isNaN(orderId)) {
        filter.orderId = Number(orderId);
      } else {
        filter.orderId = { $regex: orderId, $options: "i" };
      }
    }
    if (awbNumber) filter.awb_number = { $regex: awbNumber, $options: "i" };
    if (paymentType) {
      filter["paymentDetails.method"] = paymentType;
    }
    if (ndrStatus && ndrStatus !== "All") filter.ndrStatus = ndrStatus;
    if (status && status !== "All") filter.status = status; // <-- add this line
    if (courier) filter.courierServiceName = courier;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include full end day
    
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }
    
    if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId);
    } else if (name || email || contactNumber) {
      let userIds = [];
      const userFilter = {};
      if (name) userFilter.fullname = { $regex: name, $options: "i" };
      if (email) userFilter.email = { $regex: email, $options: "i" };
      if (contactNumber) userFilter.phoneNumber = { $regex: contactNumber, $options: "i" };
      const users = await User.find(userFilter).select("_id");
      userIds = users.map((u) => u._id);
      if (userIds.length > 0) filter.userId = { $in: userIds };
      else filter.userId = null;
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
    console.error("Error filtering NDR orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  filterOrders,
  filterNdrOrders,
  getOrdersByStatus,
  searchUser,
  getAllOrdersByNdrStatus,
  getAllOrdersByManualRtoStatus,
  filterOrdersForEmployee,
  filterNdrOrdersForEmployee,
  getAllOrdersByManualRtoStatusForEmployee,
};
