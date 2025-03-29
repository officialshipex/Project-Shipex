const getAccessToken = require("../Authorize/saveCourierController");

const createOneClickShipment = async (req, res) => {
  const accessToken = await getAccessToken();
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
      "https://sandbox.shipping-api.amazon.com/shipping/v2/oneClickShipment",
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
  const accessToken = await getAccessToken();
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

const getShipmentTracking = async (trackingId, carrierId) => {
  const accessToken = await getAccessToken();
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

const checkAmazonServiceability = async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) return;

  const shipFrom = {
    name: "John Doe",
    addressLine1: "123 Main Street",
    city: "Delhi",
    postalCode: "110001",
    countryCode: "IN",
  };

  const shipTo = {
    name: "Jane Doe",
    addressLine1: "456 Secondary Road",
    city: "Mumbai",
    postalCode: "400001",
    countryCode: "IN",
  };

  try {
    const requestBody = {
      shipFrom,
      shipTo,
      shipDate: new Date().toISOString(), // Current date-time
      packages: [
        {
          dimensions: { length: 10, width: 5, height: 5, unit: "cm" },
          weight: { value: 1.2, unit: "kg" },
        },
      ],
      channelDetails: { channelType: "Amazon" },
    //   returnTo: shipFrom, // Optional return address (same as sender)
    //   valueAddedServices: [],
    //   taxDetails: [],
    //   clientReferenceDetails: [],
    //   shipmentType: "Parcel", // Optional
    };

    const response = await axios.post(
      "https://sandbox.shipping-api.amazon.com/shipping/v2/rates",
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

    if (response.data.rates && response.data.rates.length > 0) {
      console.log("✅ Amazon Shipping is available for this pincode.");
      console.log("Available Rates:", response.data.rates);
    } else {
      console.log("❌ Amazon does not service this pincode.");
    }
  } catch (error) {
    console.error(
      "Error checking serviceability:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  createOneClickShipment,
  cancelShipment,
  getShipmentTracking,
  checkAmazonServiceability,
};
