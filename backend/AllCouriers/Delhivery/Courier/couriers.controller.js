if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const axios = require("axios");
const { fetchBulkWaybills } = require("../Authorize/saveCourierContoller");
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;
const Order = require("../../../models/newOrder.model");
const crypto = require("crypto");
const Wallet = require("../../../models/wallet");
const user = require("../../../models/User.model");
const plan = require("../../../models/Plan.model");
// HELPER FUNCTIONS
const getCurrentDateTime = () => {
  const now = new Date();
  now.setSeconds(now.getSeconds() + 30);
  const pickup_date = now.toISOString().split("T")[0];
  const pickup_time = now.toTimeString().split(" ")[0];
  return { pickup_date, pickup_time };
};
const createClientWarehouse = async (payload) => {
  if (!payload) {
    throw new Error("Payload is required to create a warehouse.");
  }

  const warehouseDetails = {
    name: payload.contactName,
    email: payload.email,
    phone: payload.phoneNumber,
    address: payload.address,
    pin: payload.pinCode,
    city: payload.city,
    state: payload.state,
    return_address: payload.address,
    return_pin: payload.pinCode,
    return_city: payload.city,
    return_state: payload.state,
    return_country: "India",
    country: "India",
  };

  try {
    const response = await axios.post(
      `${url}/api/backend/clientwarehouse/create/`,
      warehouseDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${API_TOKEN}`,
        },
      }
    );

    // console.log("Warehouse created successfully:", response.data);

    return {
      success: true,
      message: "Warehouse created successfully",
      data: response.data,
    };
  } catch (error) {
    if (
      error.response &&
      error.response.data?.data?.name === payload.contactName
    ) {
      return {
        success: true,
        message: "Warehouse already exists, proceeding to the next step",
        data: error.response.data.data,
      };
    }

    console.error(
      "Error creating warehouse:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to create warehouse. Please try again.");
  }
};

const createOrder = async (req, res) => {
  const { id, provider, finalCharges, courierServiceName } = req.body;
  const currentOrder = await Order.findById(id);
  const users = await user.findById({ _id: currentOrder.userId });
  const currentWallet = await Wallet.findById({ _id: users.Wallet });
  const waybills = await fetchBulkWaybills(1);
  const plans = await plan.findOne({ userId: currentOrder.userId });
  const createClientWarehouses = await createClientWarehouse(
    currentOrder.pickupAddress
  );
  const payment_type =
    currentOrder.paymentDetails.method === "COD" ? "COD" : "Pre-paid";

  const payloadData = {
    pickup_location: {
      name: currentOrder.pickupAddress.contactName || "Default Warehouse",
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
        quantity: currentOrder.productDetails
          .reduce((sum, product) => sum + product.quantity, 0)
          .toString(), // Total quantity
        phone: currentOrder.receiverAddress.phoneNumber,
        products_desc: currentOrder.productDetails
          .map((product) => product.name)
          .join(", "), // Join product names
        total_amount: currentOrder.paymentDetails.amount,
        name: currentOrder.receiverAddress.contactName || "Default Warehouse",
        weight: currentOrder.packageDetails.applicableWeight * 1000,
        shipment_height: currentOrder.packageDetails.volumetricWeight.height,
        shipment_width: currentOrder.packageDetails.volumetricWeight.width,
        shipment_length: currentOrder.packageDetails.volumetricWeight.length,
        cod_amount:
          payment_type === "COD"
            ? `${currentOrder.paymentDetails.amount}`
            : "0",
      },
    ],
  };

  const payload = `format=json&data=${encodeURIComponent(
    JSON.stringify(payloadData)
  )}`;

  try {
    let response;
    if (currentWallet.balance >= finalCharges) {
      response = await axios.post(`${url}/api/cmu/create.json`, payload, {
        headers: {
          Authorization: `Token ${API_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("fgddfdf", response);
    } else {
      return res.status(400).json({ success: false, message: "Low Balance" });
    }
    // const response = await axios.post(`${url}/api/cmu/create.json`, payload, {
    //   headers: {
    //     Authorization: `Token ${API_TOKEN}`,
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // });
    // console.log("dsssssssss2333333333", response.data);
    // console.log("ddddddddd",response)
    if (response.data.success) {
      const result = response.data.packages[0];
      currentOrder.status = "Ready To Ship";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.waybill;
      currentOrder.shipment_id = `${result.refnum}`;
      currentOrder.provider = provider;
      currentOrder.totalFreightCharges =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);
      currentOrder.courierServiceName = courierServiceName;

      currentOrder.shipmentCreatedAt = new Date();
      let savedOrder = await currentOrder.save();
      let balanceToBeDeducted =
        finalCharges === "N/A" ? 0 : parseInt(finalCharges);
      // console.log("sjakjska",balanceToBeDeducted)
      await currentWallet.updateOne({
        $inc: { balance: -balanceToBeDeducted },
        $push: {
          transactions: {
            channelOrderId: currentOrder.orderId || null, // Include if available
            category: "debit",
            amount: balanceToBeDeducted, // Fixing incorrect reference
            balanceAfterTransaction:
              currentWallet.balance - balanceToBeDeducted,
            date: new Date().toISOString().slice(0, 16).replace("T", " "),
            awb_number: result.waybill || "", // Ensuring it follows the schema
            description: `Freight Chages Applied`,
          },
        },
      });

      return res.status(201).json({
        message: "Shipment Created Successfully",
        data: {
          orderId: currentOrder.orderId,
          provider: provider,
          waybill: result.waybill,
        },
      });
    } else {
      return res
        .status(400)
        .json({ error: "Error creating shipment", details: response.data });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

const checkPincodeServiceabilityDelhivery = async (pincode, order_type) => {
  if (!pincode) {
    return "Pincode is required";
  }
  // console.log("klkkllkk",order_type)
  // console.log("iewoooooooooo",pincode)
  try {
    const response = await axios.get(`${url}/c/api/pin-codes/json?`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
      params: {
        filter_codes: pincode,
      },
    });
    let result = response.data.delivery_codes;
    
    let finalResult = false;

    if (result.length > 0) {
      let data = result[0].postal_code;
     
      let { pre_paid, cash, pickup, remarks } = data;

      finalResult =
        order_type === "Cash on Delivery"
          ? cash === "Y" && pickup === "Y" && remarks === ""
          : pre_paid === "Y" && pickup === "Y" && remarks === "";
    }
    
    return { success: finalResult };
  } catch (error) {
    console.error("Error fetching pincode serviceability:", error.message);

    return false;
  }
};

const trackShipmentDelhivery = async (waybill) => {
  if (!waybill) {
    // return res.status(400).json({ error: "Waybill number is required" });
    return {
      success: false,
      data: "Waybill number is required",
    };
  }

  try {
    // console.log(API_TOKEN)
    const response = await axios.get(
      `${url}/api/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          authorization: `Token ${API_TOKEN}`,
        },
      }
    );
    // console.log(response)
    // console.log("lllllllllll", response?.data?.ShipmentData[0]?.Shipment.Status)
    // console.log("cxxxxxxxx",response.data.ShipmentData[0].Shipment.Status.Status);
    // console.log("rrrrrrrrrr", response.data.ShipmentData[0].Shipment.ReferenceNo)
    // console.log()
    const status = response?.data?.ShipmentData[0]?.Shipment?.Status?.Status;
    // console.log(status)
    if (
      status === "Manifested" ||
      status === "In Transit" ||
      status === "Delivered" ||
      status === "Pending" ||
      status==="Dispatched" ||
      status ==="RTO" ||
      status ==="Not Picked"
    ) {
      return {
        success: true,
        id: response.data.ShipmentData[0].Shipment.ReferenceNo,
        data: response.data.ShipmentData[0].Shipment.Status,
      };
    } else {

      return {
        success: false,
        data: "Error in tracking",
      };
    }
  } catch (error) {
    console.error("Error tracking shipment:");
    return {
      success: false,
      data: "Error in tracking",
    };
  }
};

const generateShippingLabel = async (req, res) => {
  const { waybill } = req.params;

  if (!waybill) {
    return res.status(400).json({ error: "Waybill number is required" });
  }

  try {
    const response = await axios.get(`${url}/api/p/packing_slip`, {
      params: {
        wbns: waybill,
        pdf: true,
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping-label-${waybill}.pdf"`
    );

    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Error generating shipping label:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate shipping label",
      error: error.message,
    });
  }
};

const createPickupRequest = async (warehouse_name, awb) => {
  const result = getCurrentDateTime();

  const pickupDetails = {
    pickup_time: result.pickup_time,
    pickup_date: result.pickup_date,
    pickup_location: warehouse_name,
    expected_package_count: 1,
    waybill: `${awb}`,
  };

  if (
    !pickupDetails.pickup_time ||
    !pickupDetails.pickup_date ||
    !pickupDetails.pickup_location ||
    !pickupDetails.waybill
  ) {
    return { error: "All pickup details are required" };
  }

  try {
    const response = await axios.post(`${url}/fm/request/new/`, pickupDetails, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    if (response?.data?.success) {
      return {
        success: true,
        message: "Pickup request created successfully",
        data: response.data,
        pickupDate: pickup_date,
      };
    } else {
      return {
        success: false,
        message: "Failed to create pickup request",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to create pickup request",
      error: error.message,
    };
  }
};

// var createClientWarehouse = async (payload) => {
//  console.log("sdaaaaaaaaa",payload)
//   const warehouseDetails = {
//     name: payload.address,
//     phone: payload.phoneNumber,
//     address: payload.address,
//     pin: payload.pinCode,
//     city: payload.city,
//     state: payload.state,
//     // return_address: `${payload.addressLine1} ${payload.addressLine2}`,
//     // return_pin: payload.pinCode
//   }

//   if (!warehouseDetails) {
//     return res.status(400).json({ error: "Warehouse details are required" });
//   }

//   try {
//     const response = await axios.post(`${url}/api/backend/clientwarehouse/create/`, warehouseDetails, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Token ${API_TOKEN}`
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

const updateClientWarehouse = async (req, res) => {
  const { warehouseDetails } = req.body;

  if (!warehouseDetails) {
    return res.status(400).json({ error: "Warehouse details are required" });
  }

  try {
    const response = await axios.post(
      `${url}/api/backend/clientwarehouse/edit/`,
      warehouseDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_ACCESS_TOKEN",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Client warehouse updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating client warehouse:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update client warehouse",
      error: error.message,
    });
  }
};

const cancelOrderDelhivery = async (awb_number) => {
  console.log("I am in cancel order");

  // Check if order is already cancelled
  const isCancelled = await Order.findOne({
    awb_number: awb_number,
    status: "Cancelled",
  });

  if (isCancelled) {
    console.log("Order is already cancelled");
    return {
      error: "Order is already cancelled",
      code: 400,
    };
  }

  // Prepare payload for cancellation request
  const payload = {
    waybill: awb_number,
    cancellation: true,
  };

  try {
    const response = await axios.post(`${url}/api/p/edit`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    // Update the order status in the database
    await Order.updateOne({ awb_number: awb_number }, { $set: { status: "Cancelled" } });

    if (response?.data?.status) {
      return { data: response.data, code: 201 };
    } else {
      return {
        error: "Error in shipment cancellation",
        details: response.data,
        code: 400,
      };
    }
  } catch (error) {
    console.error("Error in cancelOrderDelhivery:", error);
    return {
      error: "Internal Server Error",
      message: error.message,
      code: 500,
    };
  }
};


module.exports = {
  createOrder,
  checkPincodeServiceabilityDelhivery,
  trackShipmentDelhivery,
  generateShippingLabel,
  createPickupRequest,
  createClientWarehouse,
  updateClientWarehouse,
  cancelOrderDelhivery,
};
