const {
  getOrderDetails,
  callShiprocketNdrApi,
  callNimbustNdrApi,
  callEcomExpressNdrApi,
  handleDelhiveryNdrAction,
  submitNdrToDtdc
} = require("../services/ndrService");
const Order = require("../models/newOrder.model");

const ndrProcessController = async (req, res) => {
  const {
    awb_number,
    action,
    comments,
    scheduled_delivery_date,
    scheduled_delivery_slot,
    mobile,
    consignee_address,
    customer_code,
    rtoAction,
    remarks
  } = req.body;

  // console.log("awb",awb_number)
  const orderDetails = await Order.findOne({ awb_number: awb_number });
  // console.log("dtdc",req.body)
  // const orderDetails = getOrderDetails(orderId);

  if (!orderDetails) {
    return res.status(404).json({ error: "Order not found" });
  }
// console.log("ordrer",orderDetails)
  try {
    let response;
    if (orderDetails.platform === "shiprocket") {
      response = await callShiprocketNdrApi(orderDetails);
    } else if (orderDetails.platform === "nimbust") {
      response = await callNimbustNdrApi(orderDetails);
    } else if (orderDetails.platform === "ecomexpress") {
      response = await callEcomExpressNdrApi(
        awb_number,
        action,
        comments,
        scheduled_delivery_date,
        scheduled_delivery_slot,
        mobile,
        consignee_address
      );
    } else if (orderDetails.provider === "Delhivery") {
      response = await handleDelhiveryNdrAction(awb_number, action);
    } else if(orderDetails.provider==="DTDC"){
      response=await submitNdrToDtdc(awb_number,customer_code,rtoAction,remarks)
    }
    else {
      return res.status(400).json({ error: "Unsupported platform" });
    }
    // console.log("resererer",response)
    res.json({ success: response.success, data: response.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { ndrProcessController };
