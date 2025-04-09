const { getAmazonAccessToken } = require("../Authorize/saveCourierController");
const axios = require("axios");

const createOneClickShipment = async (req, res) => {
  const accessToken = await getAmazonAccessToken();
  const amazonBusinessId =
    process.env.AMAZON_BUSINESS_ID || "AmazonShipping_UK"; // Default Business ID

  const shipmentData = {
    shipFrom: {
      name: "John Doe",
      addressLine1: "123 Main St",
      city: "Seattle",
      stateOrRegion: "WA",
      postalCode: "98101",
      countryCode: "US",
    },
    shipTo: {
      name: "Jane Smith",
      addressLine1: "456 Elm St",
      city: "Los Angeles",
      stateOrRegion: "CA",
      postalCode: "90001",
      countryCode: "US",
    },
    returnTo: {
      name: "Return Dept.",
      addressLine1: "789 Pine St",
      city: "New York",
      stateOrRegion: "NY",
      postalCode: "10001",
      countryCode: "US",
    },
    shipDate: new Date().toISOString(), // Current date-time
    goodsOwner: "Seller",
    packages: [
      {
        weight: { value: 2.5, unit: "KG" },
        dimensions: { length: 10, width: 5, height: 5, unit: "CM" },
      },
    ],
    channelDetails: {
      channelType: "NonAmazon",
    },
    labelSpecifications: {
      format: "PDF",
      size: "4x6",
    },
    serviceSelection: {
      serviceId: "AMZ-GROUND",
    },
  };

  try {
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

    console.log("Shipment Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating OneClickShipment:", error.response.data);
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
      `https://sellingpartnerapi-eu.amazon.com/shipping/v2/shipments/${shipmentId}/cancel`,
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
      "https://sellingpartnerapi-eu.amazon.com/shipping/v2/tracking",
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
  console.log("payloadprovider", provider, payload);
  const accessToken = await getAmazonAccessToken();
  if (!accessToken) return;

  const shipFrom = {
    name: payload.origin.contactName,
    addressLine1: payload.origin.address.slice(0, 60), // Truncate to 60 chars
    city: payload.origin.city,
    postalCode: payload.origin.pinCode,
    countryCode: "IN",
  };

  const shipTo = {
    name: payload.destination.contactName,
    addressLine1: payload.destination.address.slice(0, 60), // Truncate to 60 chars
    city: payload.destination.city,
    postalCode: payload.destination.pinCode,
    countryCode: "IN",
  };

  console.log("ahiptdkfl", payload.weight);

  try {
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
          weight: { value: payload.weight / 1000, unit: "KILOGRAM" },
          insuredValue: {
            value: 100,
            unit: "INR",
          },
          packageClientReferenceId: `${payload.orderId}`,
          items: [
            {
              itemValue: {
                value: 2,
                unit: "INR",
              },
              // "description": "book:1",
              // "itemIdentifier": "item-11111",
              quantity: 1,
              weight: {
                unit: "GRAM",
                value: 400,
              },
              isHazmat: false,
              // "productType": "books:1",
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
      channelDetails: { channelType: "EXTERNAL" },
    };
    // console.log("amaxon id",process.env.AMAZON_BUSINESS_ID)
    console.log("rererques", requestBody);
    console.log("access", accessToken);
    const response = await axios.post(
      "https://sellingpartnerapi-eu.amazon.com/shipping/v2/shipments/rates",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-amz-access-token": accessToken,
          "x-amzn-shipping-business-id": "AmazonShipping_IN", // Adjust based on region
          "Content-Type": "application/json",
        },
      }
    );
    console.log("rate", response.data.payload.rates);
    console.log("reer", response.data.payload.ineligibleRates);
    if (response.payload.data.rates && response.data.payload.rates.length > 0) {
      console.log("✅ Amazon Shipping is available for this pincode.");
      return { success: true, reason: "pincodes are serviceable." };
    } else {
      console.log("❌ Amazon does not service this pincode.");
      return { success: false, reason: "Pincodes are not serviceable" };
    }
  } catch (error) {
    console.error(
      "Error checking serviceability:",
      error.response?.data || error.message
    );
    return { success: false, reason: "Error checking serviceability" };
  }
};

module.exports = {
  createOneClickShipment,
  cancelShipment,
  getShipmentTracking,
  checkAmazonServiceability,
};
