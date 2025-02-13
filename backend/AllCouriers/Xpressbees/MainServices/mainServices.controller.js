if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const axios = require("axios");
const Order = require("../../../models/newOrder.model");
const { getToken } = require("../Authorize/XpressbeesAuthorize.controller");
const Wallet = require("../../../models/wallet");
const BASE_URL = process.env.XpreesbeesUrl;

const createShipment = async (req, res) => {
  const url = `${BASE_URL}/api/shipments2`;
  const { selectedServiceDetails, id,provider } = req.body;
  const currentOrder = await Order.findById(id);
 

  // console.log(currentOrder)
  const currentWallet = await Wallet.findById(req.body.walletId);
  const order_items = new Array(currentOrder.productDetails.length);

  currentOrder.productDetails.map((item, index) => {
    order_items[index] = {
      name: item.name,
      qty: item.quantity,
      price: item.unitPrice,
      sku: item.sku,
    };
  });
// console.log("sadasdasd",currentOrder.receiverAddress.phoneNumber)

  let payment_type = currentOrder.paymentDetails.method === "COD" ? "cod" : "prepaid";
  const shipmentData = {
    order_number: `${currentOrder.orderId}`,
    payment_type,
    order_amount: currentOrder.paymentDetails.amount,
    consignee: {
      name: `${currentOrder.receiverAddress.contactName}`,
      address: `${currentOrder.receiverAddress.address}`,
      city: currentOrder.receiverAddress.city,
      state: currentOrder.receiverAddress.state,
      pincode: `${currentOrder.receiverAddress.pinCode}`,
      phone: currentOrder.receiverAddress.phoneNumber,
    },
    pickup: {
        warehouse_name:`${currentOrder.pickupAddress.address}`,
        name: `${currentOrder.pickupAddress.contactName}`,
        address: `${currentOrder.pickupAddress.address}`,
        city: currentOrder.pickupAddress.city,
        state: currentOrder.pickupAddress.state,
        pincode: `${currentOrder.pickupAddress.pinCode}`,
        phone: currentOrder.pickupAddress.phoneNumber,
    },
    order_items,
    collectable_amount: currentOrder.paymentDetails.method === "prepaid" ? 0 :currentOrder.paymentDetails.amount,
    courier_id: selectedServiceDetails,
  };

//   console.log("hjjhjjhj",shipmentData);

  try {
    const token = await getToken();
// console.log("sadasd",shipmentData)
    const response = await axios.post(url, shipmentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    // console.log("XpressBees Create Shipment", response.data);

    if (response.data.status) {
      const result = response.data.data;
      currentOrder.status = "Ready To Ship";
      currentOrder.cancelledAtStage = null;
      currentOrder.awb_number = result.awb_number;
      currentOrder.label=result.label
      currentOrder.provider=provider
      currentOrder.shipment_id = `${result.awb_number}`;
      // currentOrder.service_details = selectedServiceDetails._id;
      // currentOrder.freightCharges =
      //   req.body.finalCharges === "N/A" ? 0 : parseInt(req.body.finalCharges);
      // currentOrder.tracking = [];
      // currentOrder.tracking.push({
      //   stage: "Order Booked",
      // });
      // console.log("sahkdjhsakdsa",currentOrder)
      await currentOrder.save();
      // console.log("sahkdjhsakdsa",currentOrder)
      // let balanceToBeDeducted =
      //   req.body.finalCharges === "N/A" ? 0 : parseInt(req.body.finalCharges);
      // let currentBalance = currentWallet.balance - balanceToBeDeducted;
      // await currentWallet.updateOne({
      //   $inc: { balance: -balanceToBeDeducted },
      //   $push: {
      //     transactions: {
      //       txnType: "Shipping",
      //       action: "debit",
      //       amount: currentBalance,
      //       balanceAfterTransaction:
      //         currentWallet.balance - balanceToBeDeducted,
      //       awb_number: `${result.awb_number}`,
      //     },
        // },
      // });

      return res.status(201).json({ message: "Shipment Created Succesfully" });
    } else {
      return res
        .status(400)
        .json({ error: "Error creating shipment", details: response.data });
    }
  } catch (error) {
    // console.log(error);
    console.error("Error in creating shipment:", error.response);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const reverseBooking = async (req, res) => {
  const { shipmentData } = req.body;
  const url = `${BASE_URL}/api/reverseshipments`;

  try {
    const token = await getToken();
    const response = await axios.post(url, shipmentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status) {
      return res.status(201).json(response.data.data);
    } else {
      return res
        .status(400)
        .json({
          error: "Error creating reverse booking",
          details: response.data,
        });
    }
  } catch (error) {
    console.error("Error in creating reverse booking:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

const trackShipment = async (trackingNumber) => {
  if (!trackingNumber) {
    return {
      success: false,
      data: "Error in tracking",
    };
  }

  const url = `${BASE_URL}/api/shipments2/track/${trackingNumber}`;

  try {
    const token = await getToken();
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status) {
      return {
        success: true,
        data: response.data.data.status,
      };
    } else {
      return {
        success: false,
        data: "Error in message",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: "Error in message",
    };
  }
};

const pickup = async (awbNumbers) => {
  if (!awbNumbers || !Array.isArray(awbNumbers) || awbNumbers.length === 0) {
    return { error: "AWB numbers must be a non-empty array" };
  }

  const url = `${BASE_URL}/api/shipments2/manifest`;

  try {
    const token = await getToken();
    const payload = { awbs: awbNumbers };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("response of xpressbees pickup", response.data);

    if (response.data.status) {
      return { success: true, data: response.data.data };
    } else {
      return {
        success: false,
        error: "Error in manifest creation",
        details: response.data,
      };
    }
  } catch (error) {
    console.error(
      "Error in creating manifest:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: "Internal Server Error",
      message: error.message,
    };
  }
};

const cancelShipmentXpressBees = async (awb) => {
 
  if (!awb) {
    return res.status(400).json({ error: "AWB number is required" });
  }

  const url = `${BASE_URL}/api/shipments2/cancel`;
  try {
    const token = await getToken();
    const payload = {awb} ;
    // console.log("sadsdsads",awb)
    // console.log("sadsdsads",token)
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    await Order.updateOne(
      { awb_number: awb }, 
      { $set: { status: "Cancelled" } } 
    );
    
    const { status, data } = response.data;
    if (status) {
      return { data, code: 201 };
    } else {
      return {
        error: "Error in shipment cancellation",
        details: response.data,
        code: 400,
      };
    }
  } catch (error) {
    console.error(
      "Error in cancelling shipment:",
      error.response?.data || error.message
    );
    return {
      error: "Internal Server Error",
      message: error.message,
      code: 500,
    };
  }
};

const exceptionList = async (req, res) => {
  try {
    const token = await getAuthToken();
    const url = `${BASE_URL}/api/ndr`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const createNDR = async (req, res) => {
  const ndrActions = req.body;

  if (!Array.isArray(ndrActions) || ndrActions.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input. NDR actions must be a non-empty array." });
  }

  const url = `${BASE_URL}/api/ndr/create`;

  try {
    const token = await getAuthToken();

    const response = await axios.post(url, ndrActions, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.some((item) => !item.status)) {
      console.warn(
        "Some actions failed:",
        response.data.filter((item) => !item.status)
      );
      return res.status(207).json({
        // HTTP 207 for partial success
        message: "Some actions failed",
        data: response.data,
      });
    }

    return res
      .status(200)
      .json({
        message: "All actions performed successfully",
        data: response.data,
      });
  } catch (error) {
    console.error(
      "Error in performing NDR actions:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: error.response?.data?.message || error.message,
      });
  }
};

const checkServiceabilityXpressBees = async (service, payload) => {
  // console.log("I am in xpress serviceability");

  const {
    origin,
    destination,
    payment_type,
    order_amount,
    weight,
    length,
    breadth,
    height,
  } = payload;

  try {
    const token = await getToken();
    // console.log(token);

    const response = await axios.post(
      `${BASE_URL}/api/courier/serviceability`,
      {
        origin,
        destination,
        payment_type,
        order_amount,
        weight,
        length,
        breadth,
        height,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("clkxlkc",response.data);
    if (response.data.status) {
      const result = response.data?.data;
      // console.log("uuuuuu",result)
      const filteredData = result.filter((item) => item.name === service);
      const Xpressbeesid = filteredData.map((value) => value.id);

      if (filteredData.length > 0) {
        return {
          success: true,
          Xpressbeesid: Xpressbeesid,
        };
      } else {
        console.log(`No courier service found matching: ${service}`);
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  createShipment,
  reverseBooking,
  createNDR,
  exceptionList,
  cancelShipmentXpressBees,
  pickup,
  trackShipment,
  checkServiceabilityXpressBees,
};
