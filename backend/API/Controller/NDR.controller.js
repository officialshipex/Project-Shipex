const Order = require("../../models/newOrder.model");
const {
  callEcomExpressNdrApi,
  callSmartshipNdrApi,
  handleDelhiveryNdrAction,
  submitNdrToDtdc,
  submitNdrToAmazon,
} = require("../../services/ndrService");

const exceptionList = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all Undelivered orders for this user
    const orders = await Order.find(
      { userId, status: "Undelivered" },
      {
        awb_number: 1,
        courier: 1,
        reattempt: 1,
        ndrReason: 1,
        ndrHistory: 1,
        _id: 0,
      }
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exception found for this user",
      });
    }

    // Filter orders: For DTDC → also require reattempt = true
    const filteredOrders = orders.filter((order) => {
      if (order.courier === "DTDC") {
        return order.reattempt === true; // ✅ Only DTDC check reattempt
      }
      return true; // ✅ Other couriers only check status
    });

    if (filteredOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching undelivered orders found after filtering",
      });
    }

    // Format response
    const formattedData = filteredOrders.map((order) => ({
      awb_number: order.awb_number,
      courier: order.courier,
      date: order.ndrReason?.date || null,
      remark: order.ndrReason?.remark || null,
      attemptCount: order.ndrHistory ? order.ndrHistory.length : 0,
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching exception list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const ndrCreate = async (req, res) => {
  try {
    const {
      courierId,
      awb_number,
      action,
      comments,
      scheduled_delivery_date,
      scheduled_delivery_slot,
      mobile,
      consignee_address,
    //   customer_code,
    //   remarks,
      next_attempt_date,
      phone,
    } = req.body;

    const userId = req.user._id;

    // ✅ Required fields check
    if (!courierId || !awb_number) {
      return res.status(400).json({
        success: false,
        message: "courierId and awb_number are required",
      });
    }

    if (action && !["RE-ATTEMPT", "RTO"].includes(action.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Allowed values are 'RE-ATTEMPT' or 'RTO'.",
      });
    }

    // Fetch order for reference (optional, but keeps consistency)
    const order = await Order.findOne({
      userId,
      awb_number,
      status: "Undelivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "No pending delivery found for the provided AWB number. Reattempt or RTO cannot be initiated.",
      });
    }

    let response;

    // ✅ Process based on courierId
    switch (courierId) {
      //   case "01": // EcomExpress
      //     if (!action || !comments) {
      //       return res.status(400).json({
      //         success: false,
      //         message: "action and comments are required for EcomExpress",
      //       });
      //     }
      //     response = await callEcomExpressNdrApi(
      //       awb_number,
      //       action,
      //       comments,
      //       scheduled_delivery_date,
      //       scheduled_delivery_slot,
      //       mobile,
      //       consignee_address
      //     );
      //     break;

      case "02": // Delhivery
        if (!action) {
          return res.status(400).json({
            success: false,
            message: `action is required for courierId ${courierId}`,
          });
        }
        response = await handleDelhiveryNdrAction(awb_number, action);
        break;

      case "03": // DTDC
        if (!action || !comments) {
          return res.status(400).json({
            success: false,
            message: `action, and comments are required for courierId ${courierId}`,
          });
        }
        response = await submitNdrToDtdc(
          awb_number,
          customer_code="123",
          action,
          comments
        );
        break;

      case "04": // Smartship
        if (!action || !comments || !next_attempt_date || !phone) {
          return res.status(400).json({
            success: false,
            message: `action, comments, next_attempt_date, and phone are required for courierId ${courierId}`,
          });
        }
        response = await callSmartshipNdrApi(
          awb_number,
          action,
          comments,
          next_attempt_date,
          phone
        );
        break;

      case "05": // Amazon
        if (!action || !comments || !scheduled_delivery_date) {
          return res.status(400).json({
            success: false,
            message: `action, comments, and scheduled_delivery_date are required for courierId ${courierId}`,
          });
        }
        response = await submitNdrToAmazon(
          awb_number,
          action,
          comments,
          scheduled_delivery_date
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid courierId provided",
        });
    }

    return res.status(200).json({
      success: true,
      message: "NDR request processed successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in ndrCreate:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while processing NDR",
      error: error?.response?.data || error.message,
    });
  }
};

module.exports = { exceptionList, ndrCreate };
