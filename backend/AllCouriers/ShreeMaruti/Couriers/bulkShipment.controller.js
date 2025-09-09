if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const axios = require("axios");
const { getToken } = require("../Authorize/shreeMaruti.controller");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/CourierService.Schema");
const Order = require("../../../models/newOrder.model");
const { getUniqueId } = require("../../getUniqueId");
const Wallet = require("../../../models/wallet");
const { getZone } = require("../../../Rate/zoneManagementController");

const BASE_URL =process.env.SHREEMA_PRODUCTION_URL
  

const createShipmentFunctionShreeMaruti = async (
  selectedServiceDetails,
  orderId,
  wh,
  walletId,
  finalCharges
) => {
  const API_URL = `${BASE_URL}/fulfillment/public/seller/order/ecomm/push-order`;

  try {
    const token = await getToken();
    const currentOrder = await Order.findById(orderId);
    const currentWallet = await Wallet.findById(walletId);
    const zone = await getZone(
      currentOrder.pickupAddress.pinCode,
      currentOrder.receiverAddress.pinCode
      // res
    );
    const services = await Services.findOne({
      name: selectedServiceDetails.name,
    });
    // console.log("zone", zone);
    if (!zone) {
      return { success: false, message: "Pincode not serviceable" };
    }
    // Prepare order items
    const lineItems = Array.from(
      { length: currentOrder.productDetails.length },
      (_, index) => {
        const item = currentOrder.productDetails[index];

        return {
          name: item.name,
          quantity: Number(item.quantity) || 0, // Ensure it's a number, default to 0 if invalid
          price: Number(item.unitPrice) * Number(item.quantity) || 0, // Ensure valid price
          unitPrice: Number(item.unitPrice) || 0, // Ensure valid unit price
          weight: currentOrder.packageDetails?.applicableWeight
            ? Math.max(
                Number(currentOrder.packageDetails.applicableWeight) * 1000,
                1
              )
            : 1,
          sku: item.sku || null,
        };
      }
    );

    // Payment and shipment details
    const payment_type =
      currentOrder.paymentDetails.method === "COD" ? "COD" : "ONLINE";
    const payment_status =
      currentOrder.paymentDetails.method === "COD" ? "PENDING" : "PAID";

    // Construct payload
    const payload = {
      orderId: `${currentOrder.orderId}`,
      orderSubtype: "FORWARD",
      currency: "INR",
      amount: parseInt(currentOrder.paymentDetails.amount),
      weight: Number(currentOrder.packageDetails.applicableWeight) * 1000 || 1,
      lineItems: lineItems,
      paymentType: payment_type,
      paymentStatus: payment_status,
      length:
        Number(currentOrder.packageDetails?.volumetricWeight?.length) || 1,
      height:
        Number(currentOrder.packageDetails?.volumetricWeight?.height) || 1,
      width: Number(currentOrder.packageDetails?.volumetricWeight?.width) || 1,
      billingAddress: {
        name: `${currentOrder.pickupAddress.contactName}`,
        phone: currentOrder.pickupAddress.phoneNumber.toString(),
        address1: currentOrder.pickupAddress.address,
        // address2: currentOrder.Biling_details.address2,
        city: currentOrder.pickupAddress.city,
        state: currentOrder.pickupAddress.state,
        country: "India",
        zip: `${currentOrder.pickupAddress.pinCode}`,
      },
      shippingAddress: {
        name: `${currentOrder.receiverAddress.contactName}`,
        phone: currentOrder.receiverAddress.phoneNumber.toString(),
        address1: currentOrder.receiverAddress.address,
        // address2: currentOrder.receiverAddress.address2,
        city: currentOrder.receiverAddress.city,
        state: currentOrder.receiverAddress.state,
        country: "India",
        zip: `${currentOrder.receiverAddress.pinCode}`,
      },
      pickupAddress: {
        name: `${currentOrder.pickupAddress.contactName}`,
        phone: currentOrder.pickupAddress.phoneNumber.toString(),
        address1: currentOrder.pickupAddress.address,
        // address2: wh.addressLine2,
        city: currentOrder.pickupAddress.city,
        state: currentOrder.pickupAddress.state,
        country: "India",
        zip: `${currentOrder.pickupAddress.pinCode}`,
      },
      returnAddress: {
        name: `${currentOrder.pickupAddress.contactName}`,
        phone: currentOrder.pickupAddress.phoneNumber.toString(),
        address1: currentOrder.pickupAddress.address,
        // address2: wh.addressLine2,
        city: currentOrder.pickupAddress.city,
        state: currentOrder.pickupAddress.state,
        country: "India",
        zip: `${currentOrder.pickupAddress.pinCode}`,
      },
      selectedCarriers: [
        {
          shortName: "SMILE",
        },
      ],
      deliveryPromise:
        services.courierType === "Domestic (Surface)" ? "SURFACE" : "AIR",
    };

    const effectiveBalance =
      currentWallet.balance - (currentWallet.holdAmount || 0);
    if (currentWallet.balance < finalCharges) {
      return { success: false, message: "Insufficient wallet balance" };
    }

    // API request
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("ShreeMaruti Response:", response.data);
    // Handle response
    if (response.status === 200) {
      const result = response.data.data;
      currentOrder.status = "Booked";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.awbNumber;
      currentOrder.shipment_id = `${result.shipperOrderId}`;
      currentOrder.provider = selectedServiceDetails.provider;
      currentOrder.totalFreightCharges = finalCharges;
      currentOrder.courierServiceName = selectedServiceDetails.name;
      currentOrder.shipmentCreatedAt = new Date();
      currentOrder.zone = zone.zone;
      currentOrder.tracking.push({
        status: "Booked",
        StatusLocation: currentOrder.pickupAddress?.city || "N/A",
        StatusDateTime: new Date(),
        Instructions: "Order booked successfully",
      });
      await currentOrder.save();

      const updatedWallet = await Wallet.findOneAndUpdate(
        { _id: walletId, balance: { $gte: finalCharges } }, // Ensure sufficient balance
        {
          $inc: { balance: -finalCharges },
          $push: {
            transactions: {
              channelOrderId: currentOrder.orderId,
              category: "debit",
              amount: finalCharges,
              balanceAfterTransaction: currentWallet.balance - finalCharges,
              date: new Date(),
              awb_number: result.awbNumber,
              description: "Freight Charges Applied",
            },
          },
        }, // Deduct the charges
        { new: true } // Return the updated document
      );

      // --- Call Manifest API ---
      try {
        const manifestResponse = await axios.post(
          `${BASE_URL}/fulfillment/public/seller/order/create-manifest`,
          {
            awbNumber: [result.awbNumber], // Order AWB
            // cAwbNumber: result.cAwbNumber || "", // Courier AWB (if available)
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Manifest Created:", manifestResponse.data);
      } catch (manifestErr) {
        console.error(
          "Error creating manifest:",
          manifestErr.response?.data || manifestErr.message
        );
        // You can decide whether to fail here or just log and continue
      }

      return {
        status: 201,
        success: true,
        message: "Shipment Created Successfully",
      };
    } else {
      return {
        status: 400,
        success: false,
        error: "Error creating shipment",
        // details: response.data,
      };
    }
  } catch (error) {
    console.log("data",error.response.data)
    console.log("message",error.response.data.message)
    console.log(error.response.data.trace);
    console.error("Error in creating shipment:", error.message);
    return {
      status: 400,
      success: false,
      error: "Error creating shipment",
      // details: response.data,
    };
  }
};

module.exports = { createShipmentFunctionShreeMaruti };
