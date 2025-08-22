const axios = require("axios");
const Order = require("../../models/newOrder.model");
const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const { getZone } = require("../../Rate/zoneManagementController");
const {
  registerSmartshipHub,
} = require("../../AllCouriers/SmartShip/Couriers/couriers.controller");
const {
  getAccessToken,
} = require("../../AllCouriers/SmartShip/Authorize/smartShip.controller");

/**
 * Registers order shipment in one step with Smartship
 *
 * @param {object} params
 * @param {string} params.id - Order ID
 * @param {string|number} params.finalCharges - Final freight charge amount
 * @param {string} params.courierServiceName - Courier service name
 * @param {string} params.provider - Provider name
 * @returns {Promise<object>} Result with success status and data or error details
 */
const createSmartshipShipment = async ({
  id,
  finalCharges,
  courierServiceName,
  provider,
}) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { success: false, message: "Access token missing" };
    }

    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return { success: false, message: "Order not found" };
    }

    const zone = await getZone(
      currentOrder.pickupAddress.pinCode,
      currentOrder.receiverAddress.pinCode
    );
    if (!zone) {
      return { success: false, message: "Pincode not serviceable" };
    }

    const user = await User.findById(currentOrder.userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const smartshipHub = await registerSmartshipHub(
      user._id,
      currentOrder.pickupAddress.pinCode
    );

    const currentWallet = await Wallet.findById(user.Wallet);
    if (!currentWallet) {
      return { success: false, message: "Wallet not found" };
    }

    const effectiveBalance =
      currentWallet.balance - (currentWallet.holdAmount || 0);

    if (effectiveBalance < finalCharges) {
      return { success: false, message: "Insufficient wallet balance" };
    }

    const productNames = currentOrder.productDetails
      .map((p) => p.name)
      .join(", ");

    const payload = {
      request_info: {
        client_id: "", // Optional
        run_type: "create",
      },
      orders: [
        {
          client_order_reference_id: currentOrder.orderId,
          shipment_type: 1,
          order_collectable_amount:
            currentOrder.paymentDetails.method === "COD"
              ? currentOrder.paymentDetails.amount
              : 0,
          total_order_value: currentOrder.paymentDetails.amount.toString(),
          payment_type: currentOrder.paymentDetails.method.toLowerCase(),
          package_order_weight: (
            currentOrder.packageDetails.applicableWeight * 1000
          ).toString(),
          package_order_length:
            currentOrder.packageDetails.volumetricWeight.length.toString(),
          package_order_height:
            currentOrder.packageDetails.volumetricWeight.height.toString(),
          package_order_width:
            currentOrder.packageDetails.volumetricWeight.width.toString(),
          shipper_hub_id: smartshipHub.hubId || "",
          shipper_gst_no: "",
          order_invoice_date: new Date().toISOString().slice(0, 10),
          order_invoice_number: `INV-${currentOrder.orderId}-${Date.now()}`,
          is_return_qc: "0",
          return_reason_id: "0",
          order_meta: {
            preferred_carriers: [279], // use given courier
          },
          product_details: currentOrder.productDetails.map((product) => ({
            client_product_reference_id: product._id.toString(),
            product_name: product.name,
            product_category: product.category || "General",
            product_hsn_code: product.hsn || "0000",
            product_quantity: product.quantity || 1,
            product_gst_tax_rate: product.gst || "0",
            product_invoice_value: product.unitPrice.toString(),
          })),
          consignee_details: {
            consignee_name: currentOrder.receiverAddress.contactName,
            consignee_phone: currentOrder.receiverAddress.phoneNumber,
            consignee_email:
              currentOrder.receiverAddress.email || "noemail@example.com",
            consignee_complete_address: currentOrder.receiverAddress.address,
            consignee_pincode: currentOrder.receiverAddress.pinCode,
          },
        },
      ],
    };

    const response = await axios.post(
      "https://api.smartship.in/v2/app/Fulfillmentservice/orderRegistrationOneStep",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.data.errors) {
      console.error("Smartship API errors:", response.data.data.errors);
      return {
        success: false,
        message: "Error creating Shipment",
      };
    }

    const respData = response.data?.data;

    if (
      (!respData?.success_order_details ||
        !respData.success_order_details.orders ||
        respData.success_order_details.orders.length === 0) &&
      respData?.duplicate_orders
    ) {
      console.error("Duplicate orders found:", respData.duplicate_orders);
      return {
        success: false,
        message:
          "Duplicate orderId is not allowed in courier Bluedart, ship with another courier",
        errors: respData.errors,
        duplicate_orders: respData.duplicate_orders,
      };
    }

    const result = respData?.success_order_details?.orders?.[0];

    if (result?.awb_number) {
      currentOrder.status = "Ready To Ship";
      currentOrder.awb_number = result.awb_number;
      currentOrder.shipment_id = result.request_order_id || "";
      currentOrder.provider = provider;
      currentOrder.totalFreightCharges = parseInt(finalCharges);
      currentOrder.courierServiceName = courierServiceName;
      currentOrder.shipmentCreatedAt = new Date();
      currentOrder.zone = zone.zone;
      await currentOrder.save();

      await currentWallet.updateOne({
        $inc: { balance: -parseInt(finalCharges) },
        $push: {
          transactions: {
            channelOrderId: currentOrder.orderId,
            category: "debit",
            amount: parseInt(finalCharges),
            balanceAfterTransaction: effectiveBalance - parseInt(finalCharges),
            date: new Date(),
            awb_number: result.awb_number,
            description: `Freight Charges Applied`,
          },
        },
      });

      return {
        success: true,
        message: "Shipment Created Successfully",
        awb_number: respData?.success_order_details?.orders?.[0].awb_number,
      };
    }
    console.error("Shipment creation failed:", respData);
    return {
      success: false,
      message: "Failed to create shipment",
      details: response.data,
    };
  } catch (error) {
    console.error("Error creating Smartship shipment:", error);
    return {
      success: false,
      message: "Failed to register order",
      error: error?.response?.data || error.message || error.toString(),
    };
  }
};

module.exports = createSmartshipShipment;
