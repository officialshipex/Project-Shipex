const axios = require("axios");
const Order = require("../../models/newOrder.model");
const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const { getZone } = require("../../Rate/zoneManagementController");
const DTDC_API_URL = process.env.DTDC_API_URL;
const API_KEY = process.env.DTDC_API_KEY;
const X_ACCESS_TOKEN = process.env.DTDC_X_ACCESS_TOKEN;

/**
 * Create shipment order with given parameters
 * @param {object} params
 * @param {string} params.id - Order ID
 * @param {string} params.provider - Provider name
 * @param {number|string} params.finalCharges - Freight charges
 * @param {string} params.courierServiceName - Courier service name
 * @param {string} params.courier - Service type id (mandatory)
 * @param {string} params.API_KEY - API key for authentication
 * @param {string} params.X_ACCESS_TOKEN - Access token for authentication
 * @param {string} params.DTDC_API_URL - Base URL for DTDC API
 * @returns {Promise<object>} Result object with success status and data or error details
 */
const createDTDCShipment = async ({
  id,
  provider,
  finalCharges,
  courierServiceName,
  courier,
}) => {
  try {
    if (!courier) {
      return {
        success: false,
        message: "service_type_id missing please refresh your page",
      };
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

    const currentWallet = await Wallet.findById(user.Wallet);
    if (!currentWallet) {
      return { success: false, message: "Wallet not found" };
    }

    const productNames = currentOrder.productDetails
      .map((product) => product.name)
      .join(", ");

    const codCollectionMode =
      currentOrder.paymentDetails.method === "COD" ? "cash" : null;
    const codAmount =
      currentOrder.paymentDetails.method === "COD"
        ? currentOrder.paymentDetails.amount
        : 0;

    const shipmentData = {
      consignments: [
        {
          customer_code: "GL9711",
          service_type_id: courier,
          load_type: "NON-DOCUMENT",
          description: productNames,
          dimension_unit: "cm",
          length: currentOrder.packageDetails.volumetricWeight.length,
          width: currentOrder.packageDetails.volumetricWeight.width,
          height: currentOrder.packageDetails.volumetricWeight.height,
          weight_unit: "kg",
          weight: currentOrder.packageDetails.applicableWeight,
          declared_value: currentOrder.paymentDetails.amount,
          num_pieces: currentOrder.productDetails.length,
          origin_details: {
            name: currentOrder.pickupAddress.contactName,
            phone: currentOrder.pickupAddress.phoneNumber,
            address_line_1: currentOrder.pickupAddress.address,
            pincode: currentOrder.pickupAddress.pinCode,
            city: currentOrder.pickupAddress.city,
            state: currentOrder.pickupAddress.state,
          },
          destination_details: {
            name: currentOrder.receiverAddress.contactName,
            phone: currentOrder.receiverAddress.phoneNumber,
            address_line_1: currentOrder.receiverAddress.address,
            pincode: currentOrder.receiverAddress.pinCode,
            city: currentOrder.receiverAddress.city,
            state: currentOrder.receiverAddress.state,
          },
          customer_reference_number: currentOrder.orderId,
          cod_collection_mode: codCollectionMode,
          cod_amount: codAmount,
          ...(courierServiceName === "Dtdc Air" && {
            commodity_id: "Others", // or use your commodity detection logic if available
          }),
          reference_number: "",
        },
      ],
    };

    // Check Wallet Balance
    const walletHoldAmount = currentWallet?.holdAmount || 0;
    const effectiveBalance = currentWallet.balance - walletHoldAmount;
    if (effectiveBalance < finalCharges) {
      return { success: false, message: "Low Balance" };
    }

    // API call to DTDC
    const response = await axios.post(
      `${DTDC_API_URL}/customer/integration/consignment/softdata`,
      shipmentData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          Authorization: `Bearer ${X_ACCESS_TOKEN}`,
        },
      }
    );

    if (response?.data?.data?.[0]?.success) {
      const result = response.data.data[0];

      // Update Order
      currentOrder.status = "Ready To Ship";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.reference_number;
      currentOrder.shipment_id = `${result.customer_reference_number}`;
      currentOrder.provider = provider;
      currentOrder.totalFreightCharges =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);
      currentOrder.courierServiceName = courierServiceName;
      currentOrder.shipmentCreatedAt = new Date();
      currentOrder.zone = zone.zone;
      await currentOrder.save();

      const balanceToBeDeducted =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);

      await Wallet.findOneAndUpdate(
        { _id: user.Wallet, balance: { $gte: balanceToBeDeducted } },
        {
          $inc: { balance: -balanceToBeDeducted },
          $push: {
            transactions: {
              channelOrderId: currentOrder.orderId || null,
              category: "debit",
              amount: balanceToBeDeducted,
              balanceAfterTransaction: currentWallet.balance - balanceToBeDeducted,
              date: new Date(),
              awb_number: result.reference_number || "",
              description: `Freight Charges Applied`,
            },
          },
        }
      );

      return {
        success: true,
        message: "Shipment Created Successfully",
        awb_number: result.reference_number,
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
      message: "Failed to create shipment",
      error: error.response?.data || error.message || error.toString(),
    };
  }
};

module.exports = createDTDCShipment;
