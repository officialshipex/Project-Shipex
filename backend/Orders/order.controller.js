const Order = require("../models/orderSchema.model");
const Services = require("../models/courierServiceSecond.model");
const Courier = require("../models/courierSecond");
const { checkServiceabilityAll } = require("./shipment.controller");
const { calculateRateForService } = require("../Rate/calculateRateController");
const User = require("../models/User.model");
const { requestShipmentPickup,cancelOrder} = require("../AllCouriers/ShipRocket/MainServices/mainServices.controller");
const { pickup,cancelShipmentXpressBees} = require("../AllCouriers/Xpressbees/MainServices/mainServices.controller");
const {cancelShipment}=require("../AllCouriers/NimbusPost/Shipments/shipments.controller");

// Utility function to calculate order totals
function calculateOrderTotals(orderData) {
  let subTotal = 0;
  let productDiscount = 0;

  // Calculate sub-total and product discounts
  orderData.productDetails.forEach(product => {
    const { quantity, unitPrice, discount = 0 } = product;
    console.log("quantity:", quantity, "unitprice:", unitPrice, "discount:", discount);

    const productTotal = quantity * unitPrice;
    console.log("productTotal:", productTotal);

    subTotal += productTotal;
    console.log("subtotal:", subTotal);

    productDiscount += (productTotal * discount) / 100;  // Assuming discount is a percentage
    console.log("productDiscount:", productDiscount);

  });

  // Calculate other charges
  const shipping = orderData.orderDetails.shippingCharges || 0;
  console.log("shiping:", shipping);

  const giftWrap = orderData.orderDetails.giftWrap || 0;
  console.log("giftwrap:", giftWrap);


  // Calculate additional discount on the whole order
  const additionalDiscount = orderData.orderDetails?.additionalDiscount || 0;
  console.log("additionalDiscount:", additionalDiscount);

  const discountAmount = (subTotal * additionalDiscount) / 100;
  console.log("discountAmauont:", discountAmount);


  // Total order value calculation
  const totalOrderValue = subTotal + shipping + giftWrap - productDiscount - discountAmount;

  return {
    subTotal,
    otherCharges: shipping + giftWrap,
    discount: productDiscount + discountAmount,
    totalOrderValue
  };
}


const createOrder = async (req, res) => {
  try {
    console.log("I am in createOrder");
    const data = req.body.formData;
    const id = req.body.user._id;
    const shipping_is_billing = req.body.isSame;

    const currentUser = await User.findById(id);

    let newOrder = new Order({
      order_id: data.orderInfo.orderID,
      order_type: data.orderInfo.orderType,
      orderCategory: 'B2C-forward',
      shipping_details: data.shippingInfo,
      Biling_details: data.billingInfo,
      Product_details: data.productDetails,
      shipping_cost: data.shippingCost,
      status: 'Not-Shipped',
      sub_total: data.sub_total,
      shipping_is_billing
    });

    let result = await newOrder.save();
    currentUser.orders.push(result._id);
    await currentUser.save();
    res.status(201).json({ message: "Order created successfully", order: result });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};




const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getOrderDetails = async (req, res) => {
  try {
    let id = req.body.id;
    let result = await Order.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Server error, unable to fetch order details" });
  }
};

const shipOrder = async (req, res) => {
  try {
    // const enabledServices = await Services.find({ isEnabeled: true });
    const currentOrder = await Order.findById(req.body.id);

    const servicesCursor = Services.find({ isEnabeled: true });
    const enabledServices = [];

    for await (const srvc of servicesCursor) {
      const provider = await Courier.findOne({ provider: srvc.courierProviderName });

      if (provider?.isEnabeled === true && provider?.toEnabeled === false) {
        enabledServices.push(srvc);
      }
    }

    const availableServices = await Promise.all(
      enabledServices.map(async (item) => {
        let result = await checkServiceabilityAll(item, req.body.id, req.body.pincode);
        if (result) {
          return item;
        }
      })
    );

    const filteredServices = availableServices.filter(Boolean);
    // console.log(filteredServices);

    const payload = {
      pickupPincode: req.body.pincode,
      deliveryPincode: currentOrder.Biling_details.pinCode,
      length: currentOrder.shipping_cost.dimensions.length,
      breadth: currentOrder.shipping_cost.dimensions.width,
      height: currentOrder.shipping_cost.dimensions.height,
      weight: currentOrder.shipping_cost.weight,
      cod: currentOrder.order_type === 'Cash on Delivery' ? "Yes" : "No",
      valueInINR: currentOrder.sub_total,
      filteredServices,
      rateCardType: "Basic"
    };

    let rates = await calculateRateForService(payload);


    res.status(201).json({
      success: true,
      services: filteredServices,
      rates
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message,
    });
  }
};


const cancelOrdersAtNotShipped = async (req, res) => {
  const ordersToBeCancelled = req.body.items;

  if (!Array.isArray(ordersToBeCancelled) || ordersToBeCancelled.length === 0) {
    return res.status(400).send({ error: 'Invalid input. Please provide a valid list of orders to cancel.' });
  }

  try {
    const updatePromises = ordersToBeCancelled.map(async (order) => {
      const currentOrder = await Order.findById(order._id);

      if (currentOrder && currentOrder.status !== 'Cancelled') {
        currentOrder.status = 'Cancelled';
        currentOrder.cancelledAtStage = 'Not-Shipped';
        return currentOrder.save();
      }
    });

    await Promise.all(updatePromises);

    const message =
      ordersToBeCancelled.length > 1
        ? 'Orders cancelled successfully'
        : 'Order has been cancelled successfully';

    res.status(201).send({ message });
  } catch (error) {
    console.error('Error canceling orders:', {
      error,
      orders: ordersToBeCancelled.map((order) => order._id),
    });
    res.status(500).send({ error: 'An error occurred while cancelling orders.' });
  }
};




const requestPickup = async (req, res) => {
  const allOrders = req.body.items;
  
  if (!allOrders || allOrders.length === 0) {
    return res.status(400).json({ error: "No orders provided." });
  }

  try {
    const results = await Promise.all(allOrders.map(async (order) => {
      let currentOrder = await Order.findById(order._id).populate('service_details');
      let updateStatus = { orderId: order._id, status: "Failed" };

      if (!currentOrder) {
        updateStatus.error = "Order not found";
        return updateStatus;
      }

      try {
        if (currentOrder.service_details.courierProviderName === "NimbusPost") {
          currentOrder.status = "WaitingPickup";
          await currentOrder.save();
          updateStatus.status = "WaitingPickup";

        } else if (currentOrder.service_details.courierProviderName === "Shiprocket") {
          const result = await requestShipmentPickup(currentOrder.shipment_id);
          if (result.success) {
            currentOrder.status = "WaitingPickup";
            currentOrder.pickup_details.pickup_scheduled_date=result.data.response.pickup_scheduled_date;
            currentOrder.pickup_details.pickup_token_number=result.data.response.pickup_token_number;
            currentOrder.pickup_details.pickup_generated_date=result.data.response.pickup_generated_date.date;
            await currentOrder.save();
            updateStatus.status = "WaitingPickup";
          } else {
            updateStatus.error = "Shiprocket pickup failed";
          }

        } else if (currentOrder.service_details.courierProviderName === "Xpressbees") {
          const result = await pickup([currentOrder.awb_number]);
          if (result.success) {
            currentOrder.status = "WaitingPickup";
            await currentOrder.save();
            updateStatus.status = "WaitingPickup";
          } else {
            updateStatus.error = "Xpressbees pickup failed";
          }
        } else {
          updateStatus.error = "Unsupported courier provider";
        }

      } catch (error) {
        updateStatus.error = error.message || "Unknown error";
      }

      return updateStatus;
    }));

    const successCount = results.filter(r => r.status === "WaitingPickup").length;
    const failedCount = results.filter(r => r.status === "Failed").length;

    return res.status(201).json({
      success: true,
      message: `${successCount} orders updated successfully, ${failedCount} failed.`,
      details: results
    });

  } catch (error) {
    console.error('Error processing pickup requests:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};



const cancelOrdersAtBooked = async (req, res) => {
  const allOrders = req.body.items;

  if (!Array.isArray(allOrders) || allOrders.length === 0) {
    return res.status(400).send({ error: 'Invalid input. Please provide a valid list of orders to cancel.' });
  }

  try {
    const ordersFromDb = await Promise.all(
      allOrders.map(order => Order.findById(order._id).populate('service_details'))
    );

    const cancellationResults = await Promise.all(
      ordersFromDb.map(async (currentOrder) => {
        if (!currentOrder) {
          return { error: 'Order not found', orderId: currentOrder._id };
        }

        if (currentOrder.status === 'Not-Shipped' && currentOrder.cancelledAtStage == null) {
          return { message: 'Order already cancelled', orderId: currentOrder._id };
        }

        if (currentOrder.service_details.courierProviderName === 'NimbusPost') {
          const result = await cancelShipment(currentOrder.awb_number);
          if (result.error) {
            return { error: 'Failed to cancel shipment with NimbusPost', details: result, orderId: currentOrder._id };
          }
        } else if (currentOrder.service_details.courierProviderName === 'Shiprocket') {
          const result=await cancelOrder(currentOrder._id);
          if (!result.success) {
            return { error: 'Failed to cancel shipment with Shiprocket', details: result, orderId: currentOrder._id };
          }
          else if (currentOrder.service_details.courierProviderName ==='Xpressbees') {
            const result=await cancelShipmentXpressBees(currentOrder.awb_number);
            if (result.error) {
              return { error: 'Failed to cancel shipment with NimbusPost', details: result, orderId: currentOrder._id };
            }
          }

        } else {
          return { error: 'Unsupported courier provider', orderId: currentOrder._id };
        }

        currentOrder.status = 'Not-Shipped';
        currentOrder.cancelledAtStage = 'Booked';
        await currentOrder.save();

        return { message: 'Order cancelled successfully', orderId: currentOrder._id };
      })
    );

    
    let successCount = 0;
    let failureCount = 0;
    cancellationResults.forEach(result => {
      if (result.error) {
        failureCount++;
      } else {
        successCount++;
      }
    });

    res.status(201).send({
      results: cancellationResults,
      successCount,
      failureCount
    });
  } catch (error) {
    console.error('Error cancelling orders:', error);
    res.status(500).send({ error: 'An error occurred while cancelling orders.' });
  }
};







module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  shipOrder,
  cancelOrdersAtNotShipped,
  requestPickup,
  cancelOrdersAtBooked
}