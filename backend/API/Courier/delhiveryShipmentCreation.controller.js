const axios = require("axios");
const Order = require("../../models/newOrder.model");
const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const { getZone } = require("../../Rate/zoneManagementController");
const { createClientWarehouse } = require("../../AllCouriers/Delhivery/Courier/couriers.controller"); // Adjust path as needed
const { fetchBulkWaybills } = require("../../AllCouriers/Delhivery/Authorize/saveCourierContoller"); // Adjust path as needed
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;

const createDelhiveryShipment = async ({ id, provider, finalCharges, courierServiceName }) => {
  try {
    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return { success: false, message: "Order not found" };
    }

    const users = await User.findById(currentOrder.userId);
    if (!users) {
      return { success: false, message: "User not found" };
    }

    const currentWallet = await Wallet.findById(users.Wallet);
    if (!currentWallet) {
      return { success: false, message: "Wallet not found" };
    }

    const waybills = await fetchBulkWaybills(1);
    if (!waybills.length) {
      return { success: false, message: "No Waybill Available" };
    }

    const warehouseCreationResult = await createClientWarehouse(currentOrder.pickupAddress);
    if (!warehouseCreationResult.success) {
      return {
        success: false,
        message: "Failed to create or fetch pickup warehouse",
        details: warehouseCreationResult,
      };
    }

    const zone = await getZone(currentOrder.pickupAddress.pinCode, currentOrder.receiverAddress.pinCode);
    if (!zone) {
      return { success: false, message: "Pincode not serviceable" };
    }

    const pickupWarehouseName = warehouseCreationResult.data?.name || currentOrder.pickupAddress.contactName;

    const payment_type = currentOrder.paymentDetails.method === "COD" ? "COD" : "Pre-paid";

    const payloadData = {
      pickup_location: {
        name: pickupWarehouseName,
      },
      shipments: [
        {
          Waybill: waybills[0],
          country: "India",
          city: currentOrder.receiverAddress.city,
          pin: currentOrder.receiverAddress.pinCode,
          state: currentOrder.receiverAddress.state,
          order: currentOrder.orderId,
          add: currentOrder.receiverAddress.address || "Default Warehouse",
          payment_mode: payment_type,
          quantity: currentOrder.productDetails.reduce((sum, product) => sum + product.quantity, 0).toString(),
          phone: currentOrder.receiverAddress.phoneNumber,
          products_desc: currentOrder.productDetails.map(product => product.name).join(", "),
          total_amount: currentOrder.paymentDetails.amount,
          name: currentOrder.receiverAddress.contactName || "Default Warehouse",
          weight: currentOrder.packageDetails.applicableWeight * 1000,
          shipment_height: currentOrder.packageDetails.volumetricWeight.height,
          shipment_width: currentOrder.packageDetails.volumetricWeight.width,
          shipment_length: currentOrder.packageDetails.volumetricWeight.length,
          cod_amount: payment_type === "COD" ? `${currentOrder.paymentDetails.amount}` : "0",
        },
      ],
    };

    const payload = `format=json&data=${encodeURIComponent(JSON.stringify(payloadData))}`;

    const walletHoldAmount = currentWallet?.holdAmount || 0;
    const effectiveBalance = currentWallet.balance - walletHoldAmount;

    if (effectiveBalance < finalCharges) {
      return { success: false, message: "Insufficient Wallet Balance" };
    }

    const response = await axios.post(`${url}/api/cmu/create.json`, payload, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success && response.data.packages.length) {
      const result = response.data.packages[0];

      currentOrder.status = "Ready To Ship";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.waybill;
      currentOrder.shipment_id = `${result.refnum}`;
      currentOrder.provider = provider;
      currentOrder.totalFreightCharges = finalCharges === "N/A" ? 0 : parseInt(finalCharges);
      currentOrder.courierServiceName = courierServiceName;
      currentOrder.shipmentCreatedAt = new Date();
      currentOrder.zone = zone.zone;
      await currentOrder.save();

      const balanceToBeDeducted = finalCharges === "N/A" ? 0 : parseInt(finalCharges);

      await currentWallet.updateOne({
        $inc: { balance: -balanceToBeDeducted },
        $push: {
          transactions: {
            channelOrderId: currentOrder.orderId || null,
            category: "debit",
            amount: balanceToBeDeducted,
            balanceAfterTransaction: currentWallet.balance - balanceToBeDeducted,
            date: new Date(),
            awb_number: result.waybill || "",
            description: `Freight Charges Applied`,
          },
        },
      });

      return {
        success: true,
        message: "Shipment Created Successfully",
        awb_number:result.waybill,
      };
    } else {
      return {
        success: false,
        message: "Failed to create shipment",
        details: response.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to create order.",
      error: error.message,
    };
  }
};

module.exports = createDelhiveryShipment;
