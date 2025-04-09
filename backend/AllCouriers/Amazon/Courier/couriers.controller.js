const { getAmazonAccessToken } = require("../Authorize/saveCourierController");
const axios = require("axios");
const Order=require("../../../models/newOrder.model")

const createOneClickShipment = async (req, res) => {
  try {
    const accessToken = await getAmazonAccessToken();
    if (!accessToken) {
      return res.status(401).json({ error: "Access token missing" });
    }

    const { id, provider, finalCharges, courierServiceName } = req.body;
    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const amazonBusinessId = process.env.AMAZON_BUSINESS_ID || "AmazonShipping_IN"; // Default to India region

    const {
      pickupAddress,
      receiverAddress,
      packageDetails,
      orderId,
      paymentDetails,
    } = currentOrder;

    const shipmentData = {
      shipFrom: {
        name: pickupAddress.contactName,
        addressLine1: pickupAddress.address.slice(0, 60),
        city: pickupAddress.city,
        stateOrRegion: pickupAddress.state,
        postalCode: pickupAddress.pinCode,
        countryCode: "IN",
      },
      shipTo: {
        name: receiverAddress.contactName,
        addressLine1: receiverAddress.address.slice(0, 60),
        city: receiverAddress.city,
        stateOrRegion: receiverAddress.state,
        postalCode: receiverAddress.pinCode,
        countryCode: "IN",
      },
      returnTo: {
        name: pickupAddress.contactName,
        addressLine1: pickupAddress.address.slice(0, 60),
        city: pickupAddress.city,
        stateOrRegion: pickupAddress.state,
        postalCode: pickupAddress.pinCode,
        countryCode: "IN",
      },
      shipDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      goodsOwner: "Seller",
      packages: [
        {
          weight: {
            value: packageDetails.applicableWeight || packageDetails.deadWeight || 0.5,
            unit: "KILOGRAM",
          },
          dimensions: {
            length: packageDetails.volumetricWeight.length || 10,
            width: packageDetails.volumetricWeight.width || 10,
            height: packageDetails.volumetricWeight.height || 10,
            unit: "CENTIMETER",
          },
        },
      ],
      channelDetails: {
        channelType: "EXTERNAL",
      },
      labelSpecifications: {
        format: "PDF",
        size: "4x6",
      },
      serviceSelection: {
        serviceId: courierServiceName || "AMZ-GROUND",
      },
    };

    const response = await axios.post(
      "https://sellingpartnerapi-eu.amazon.com/shipping/v2/oneClickShipment",
      shipmentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": amazonBusinessId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Shipment Created:", response.data);
    return res.status(200).json({
      success: true,
      message: "Shipment created successfully",
      shipment: response.data,
    });
  } catch (error) {
    console.error("❌ Error creating OneClickShipment:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Error creating OneClickShipment",
      details: error.response?.data || error.message,
    });
  }
};


const cancelShipment = async (shipmentId) => {
  const accessToken = await getAmazonAccessToken();
  // console.log("accessToken",accessToken)
  if (!accessToken) {
    console.error("Failed to get access token");
    return;
  }

  const amazonBusinessId =
    process.env.AMAZON_BUSINESS_ID || "AmazonShipping_UK"; // Default Business ID

  try {
    const response = await axios.put(
      `https://sandbox.shipping-api.amazon.com/shipping/v2/shipments/${shipmentId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": amazonBusinessId,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Shipment Cancelled Successfully");
    return response.data; // Amazon returns an empty object on success
  } catch (error) {
    console.error(
      "Error cancelling shipment:",
      error.response?.data || error.message
    );
  }
};

// cancelShipment(121212)

const getShipmentTracking = async (trackingId, carrierId) => {
  const accessToken = await getAmazonAccessToken();
  if (!accessToken) {
    console.error("Failed to get access token");
    return;
  }

  const amazonBusinessId =
    process.env.AMAZON_BUSINESS_ID || "AmazonShipping_UK"; // Default Business ID

  try {
    const response = await axios.get(
      "https://sandbox.shipping-api.amazon.com/shipping/v2/tracking",
      {
        params: { trackingId, carrierId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": amazonBusinessId,
        },
      }
    );

    console.log("Tracking Information:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching tracking information:",
      error.response?.data || error.message
    );
  }
};

const checkAmazonServiceability = async (provider, payload) => {
  try {
    console.log("payloadprovider", payload);

    const accessToken = await getAmazonAccessToken();
    if (!accessToken) return { success: false, reason: "Missing access token" };

    const shipFrom = {
      name: payload.origin.contactName,
      addressLine1: payload.origin.address.slice(0, 60),
      city: payload.origin.city,
      postalCode: payload.origin.pinCode,
      countryCode: "IN",
    };

    const shipTo = {
      name: payload.destination.contactName,
      addressLine1: payload.destination.address.slice(0, 60),
      city: payload.destination.city,
      postalCode: payload.destination.pinCode,
      countryCode: "IN",
    };

    const requestBody = {
      shipFrom,
      shipTo,
      shipDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      packages: [
        {
          dimensions: {
            length: payload.length,
            width: payload.breadth,
            height: payload.height,
            unit: "CENTIMETER",
          },
          weight: {
            value: payload.weight / 1000, // Convert grams to kg
            unit: "KILOGRAM",
          },
          insuredValue: {
            value: payload.order_amount || 100,
            unit: "INR",
          },
          packageClientReferenceId: `${payload.orderId || "ORDER123"}`,
          items: [
            {
              itemValue: {
                value: payload.order_amount || 2,
                unit: "INR",
              },
              quantity: 1,
              weight: {
                unit: "GRAM",
                value: payload.weight || 400,
              },
              isHazmat: false,
              invoiceDetails: {
                invoiceDate: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
              },
            },
          ],
        },
      ],
      taxDetails: [
        {
          taxType: "GST",
          taxRegistrationNumber: "06FKCPS6109D3Z7",
        },
      ],
      channelDetails: {
        channelType: "EXTERNAL",
      },
    };

    const response = await axios.post(
      "https://sellingpartnerapi-eu.amazon.com/shipping/v2/shipments/rates",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": "AmazonShipping_IN",
          "Content-Type": "application/json",
        },
      }
    );

    const rates = response.data.payload.rates || [];
    const ineligibleRates = response.data.payload.ineligibleRates || [];

    if (rates.length > 0) {
      console.log("✅ Amazon Shipping is available for this pincode.",rates);
      return { success: true, reason: "Pincodes are serviceable"};
    } else if (ineligibleRates.length > 0) {
      console.log("❌ Amazon does not service this pincode.");
      return { success: false, reason: "Pincodes are not serviceable", ineligibleRates };
    } else {
      return { success: false, reason: "No rates returned by Amazon" };
    }
  } catch (error) {
    console.error("Error checking serviceability:", error.response?.data || error.message);
    return { success: false, reason: "Error checking serviceability" };
  }
};


module.exports = {
  createOneClickShipment,
  cancelShipment,
  getShipmentTracking,
  checkAmazonServiceability,
};
