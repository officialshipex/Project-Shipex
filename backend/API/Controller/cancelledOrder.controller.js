const user = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const Order = require("../../models/newOrder.model");
const { cancelOrderDelhivery } = require("../../AllCouriers/Delhivery/Courier/couriers.controller");
const { cancelOrderDTDC } = require("../../AllCouriers/DTDC/Courier/couriers.controller");
const { cancelSmartshipOrder } = require("../../AllCouriers/SmartShip/Couriers/couriers.controller");
const { cancelShipment } = require("../../AllCouriers/Amazon/Courier/couriers.controller");

// Assuming other cancel functions are imported similarly

const cancelOrdersAtBooked = async (req, res) => {
  try {
    const { awb_number } = req.params;
    if (!awb_number) {
      return res.status(400).json({ error: "AWB number is required in params" });
    }

    // Find order by awb_number
    const currentOrder = await Order.findOne({ awb_number });
    if (!currentOrder) {
      return res.status(404).json({ error: `Order with AWB number ${awb_number} not found.` });
    }

    // Validate order status and awb_number
    if (currentOrder.awb_number === "N/A" || !currentOrder.awb_number) {
      return res.status(400).json({ error: "Order cannot be cancelled: missing or invalid AWB number" });
    }
    if (currentOrder.status === "Cancelled" || currentOrder.status === "new") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }
    if (currentOrder.status !== "Ready To Ship") {
      return res.status(400).json({ error: "Order is not ready to be cancelled" });
    }

    // Find user and wallet
    const userDoc = await user.findById(currentOrder.userId);
    if (!userDoc) {
      return res.status(404).json({ error: "User linked with order not found" });
    }

    const currentWallet = await Wallet.findById(userDoc.Wallet);
    if (!currentWallet) {
      return res.status(404).json({ error: "Wallet linked with user not found" });
    }

    // Call cancellation API based on provider
    let result;
    switch (currentOrder.provider) {
      case "Xpressbees":
        result = await cancelShipmentXpressBees(currentOrder.awb_number);
        break;
      case "Shiprocket":
        result = await cancelOrder(currentOrder.awb_number);
        break;
      case "Delhivery":
        result = await cancelOrderDelhivery(currentOrder.awb_number);
        break;
      case "DTDC":
        result = await cancelOrderDTDC(currentOrder.awb_number);
        break;
      case "Amazon":
        result = await cancelShipment(currentOrder.shipment_id);
        break;
      case "Smartship":
        result = await cancelSmartshipOrder(currentOrder.orderId);
        break;
      // Add other providers as needed here
      default:
        return res.status(400).json({ error: "Unsupported courier provider" });
    }

    if (result?.error || (result.success === false)) {
      return res.status(400).json({ error: result.error || "Failed to cancel order" });
    }

    // Update order status and add tracking info
    currentOrder.status = "new"; // or "Cancelled" if your flow prefers
    currentOrder.tracking.push({
      status: "Cancelled",
      StatusLocation:"",
      Instructions: "Cancelled order by user",
      StatusDateTime: new Date(),
    });

    await currentOrder.save();

    // Refund wallet balance if applicable
    const balanceToBeAdded = currentOrder.totalFreightCharges === "N/A"
      ? 0
      : parseInt(currentOrder.totalFreightCharges);

    if (balanceToBeAdded > 0) {
      await currentWallet.updateOne({
        $inc: { balance: balanceToBeAdded },
        $push: {
          transactions: {
            channelOrderId: currentOrder.orderId || null,
            category: "credit",
            amount: balanceToBeAdded,
            balanceAfterTransaction: currentWallet.balance + balanceToBeAdded,
            date: new Date(),
            awb_number: currentOrder.awb_number,
            description: "Freight Charges Received",
          },
        },
      });
    }

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "An internal error occurred while cancelling the order." });
  }
};

module.exports = cancelOrdersAtBooked;
