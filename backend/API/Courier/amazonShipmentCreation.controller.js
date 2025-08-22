const axios = require("axios");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const Order = require("../../models/newOrder.model");
const User = require("../../models/User.model");
const Wallet = require("../../models/wallet");
const {
  getAmazonAccessToken,
} = require("../../AllCouriers/Amazon/Authorize/saveCourierController"); // Assuming you have this helper
const { getZone } = require("../../Rate/zoneManagementController");
const {
  checkAmazonServiceability,
} = require("../../AllCouriers/Amazon/Courier/couriers.controller");
const { s3 } = require("../../config/s3"); // Your AWS S3 client instance

/**
 * Creates an Amazon one-click shipment
 * @param {object} params - Shipment parameters
 * @param {string} params.id - Order id
 * @param {string} params.provider - Courier provider
 * @param {number|string} params.finalCharges - Final freight charges
 * @param {string} params.courierServiceName - Courier service name
 * @returns {Promise<object>} Result including success message and AWB number or error details
 */
const createAmazonShipment = async ({
  id,
  provider,
  finalCharges,
  courierServiceName,
}) => {
  try {
    const accessToken = await getAmazonAccessToken();
    if (!accessToken) {
      return { success: false, error: "Access token missing" };
    }

    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return { success: false, error: "Order not found" };
    }

    const zone = await getZone(
      currentOrder.pickupAddress.pinCode,
      currentOrder.receiverAddress.pinCode
    );
    if (!zone) {
      return { success: false, error: "Pincode not serviceable" };
    }

    const user = await User.findById(currentOrder.userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const currentWallet = await Wallet.findById(user.Wallet);
    if (!currentWallet) {
      return { success: false, error: "Wallet not found" };
    }

    const weight = currentOrder.packageDetails?.applicableWeight * 1000 || 0;

    const payload = {
      origin: currentOrder.pickupAddress,
      destination: currentOrder.receiverAddress,
      payment_type: currentOrder.paymentDetails?.method,
      order_amount: currentOrder.paymentDetails?.amount || 0,
      weight,
      length: currentOrder.packageDetails.volumetricWeight?.length || 0,
      breadth: currentOrder.packageDetails.volumetricWeight?.width || 0,
      height: currentOrder.packageDetails.volumetricWeight?.height || 0,
      productDetails: currentOrder.productDetails,
      orderId: currentOrder.orderId,
    };

    const { rate, requestToken, valueAddedServiceIds } =
      await checkAmazonServiceability("Amazon", payload);
    console.log("Extracted VAS IDs from rate:", valueAddedServiceIds);
    const isCOD = payload.payment_type === "COD";

    const shipmentData = {
      requestToken,
      rateId: rate,
      requestedDocumentSpecification: {
        format: "PDF",
        size: {
          width: 4.0,
          length: 6.0,
          unit: "INCH",
        },
        dpi: 300,
        pageLayout: "DEFAULT",
        needFileJoining: false,
        requestedDocumentTypes: ["LABEL"],
      },
      requestedValueAddedServices: [
        ...(isCOD ? [{ id: "CollectOnDelivery" }] : []),
      ],
    };

    const walletHoldAmount = currentWallet?.holdAmount || 0;
    const effectiveBalance = currentWallet.balance - walletHoldAmount;

    if (effectiveBalance < finalCharges) {
      return { success: false, error: "Low Balance" };
    }

    const response = await axios.post(
      "https://sellingpartnerapi-eu.amazon.com/shipping/v2/shipments",
      shipmentData,
      {
        headers: {
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": "AmazonShipping_IN",
          "Content-Type": "application/json",
        },
      }
    );
    const result = response.data.payload;
    if (response?.data?.payload) {
      const base64Label =
        result.packageDocumentDetails[0].packageDocuments[0].contents;
      const labelBuffer = Buffer.from(base64Label, "base64");
      const labelKey = `labels/${Date.now()}_${
        currentOrder.orderId || "label"
      }.pdf`;

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: labelKey,
        Body: labelBuffer,
        ContentType: "application/pdf",
      });

      await s3.send(uploadCommand);

      const labelUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${labelKey}`;

      currentOrder.status = "Ready To Ship";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.packageDocumentDetails[0].trackingId;
      currentOrder.shipment_id = `${result.shipmentId}`;
      currentOrder.provider = provider;
      currentOrder.totalFreightCharges =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);
      currentOrder.courierServiceName = courierServiceName;
      currentOrder.shipmentCreatedAt = new Date();
      currentOrder.label = labelUrl;
      currentOrder.zone = zone.zone;

      await currentOrder.save();

      const balanceToBeDeducted =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);

      await currentWallet.updateOne({
        $inc: { balance: -balanceToBeDeducted },
        $push: {
          transactions: {
            channelOrderId: currentOrder.orderId || null,
            category: "debit",
            amount: balanceToBeDeducted,
            balanceAfterTransaction:
              currentWallet.balance - balanceToBeDeducted,
            date: new Date(),
            awb_number: result.packageDocumentDetails[0].trackingId || "",
            description: "Freight Charges Applied",
          },
        },
      });

      return {
        success: true,
        message: "Shipment Created Successfully",
        awb_number: result.packageDocumentDetails[0].trackingId,
        labelUrl,
      };
    } else {
      return { success: false, error: "Error creating shipment" };
    }
  } catch (error) {
    return {
      success: false,
      error: "Error creating shipment",
      details: error.response?.data || error.message || error.toString(),
    };
  }
};

module.exports = createAmazonShipment;
