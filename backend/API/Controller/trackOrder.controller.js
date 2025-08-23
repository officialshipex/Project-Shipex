const Order = require("../../models/newOrder.model");

const trackOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { awb } = req.params;

    // Find order by AWB number and userId
    const order = await Order.findOne({ awb_number: awb, userId: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you don't have access to this order",
      });
    }

    // Format tracking details
    const tracking = (order.tracking || [])
      .filter((t) => t.status) // remove empty placeholder objects
      .map((t) => ({
        status: t.status,
        location: t.StatusLocation,
        dateTime: t.StatusDateTime,
        instructions: t.Instructions,
      }));

    // Build response object
    const responseData = {
      awb_number: order.awb_number,
      orderId: order.orderId,
      status: order.status,
      courierServiceName: order.courierServiceName,
      tracking,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching tracking details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = trackOrder;
