const Order = require("../../models/newOrder.model");
const Joi = require("joi");

// Your existing externalOrderSchema with the same validations
const externalOrderSchema = Joi.object({
  // Remove orderId from input schema since you'll generate it internally
  pickupAddress: Joi.object({
    contactName: Joi.string().required(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .message("Phone number must be exactly 10 digits")
      .required(),
    address: Joi.string().required(),
    pinCode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .message("Pin code must be exactly 6 digits")
      .required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),

  receiverAddress: Joi.object({
    contactName: Joi.string().required(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .message("Phone number must be exactly 10 digits")
      .required(),
    address: Joi.string().required(),
    pinCode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .message("Pin code must be exactly 6 digits")
      .required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),

  productDetails: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        quantity: Joi.number().required(),
        name: Joi.string().required(),
        sku: Joi.string().optional(),
        unitPrice: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  packageDetails: Joi.object({
    deadWeight: Joi.number().required(),
    applicableWeight: Joi.number().required(),
    volumetricWeight: Joi.object({
      length: Joi.number().required(),
      width: Joi.number().required(),
      height: Joi.number().required(),
      calculatedWeight: Joi.number().optional(),
    }).required(),
  }).required(),

  paymentDetails: Joi.object({
    method: Joi.string().valid("COD", "Prepaid").required(),
    amount: Joi.number().when("method", {
      is: "Prepaid",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }).required(),

  shipmentId: Joi.number().optional(),
  // commodityId: Joi.number().optional(),
});

const orderCreationController = async (req, res) => {
  try {
    // Validate input - exclude orderId since you'll generate it
    const { error, value } = externalOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.message,
      });
    }

    const {
      pickupAddress,
      receiverAddress,
      productDetails,
      packageDetails,
      paymentDetails,
      shipmentId
    } = value;

    // Generate unique 6-digit orderId for channelId field

    let orderId;
    let isUnique = false;
    while (!isUnique) {
      orderId = Math.floor(100000 + Math.random() * 900000); // 6-digit number
      const exists = await Order.findOne({ channelId: orderId });
      if (!exists) isUnique = true;
    }

    const userId = req.user?._id || "external";
    const compositeOrderId = `${userId}-${orderId}`;

    // Check if compositeOrderId already exists (unlikely but safe)
    const existingOrder = await Order.findOne({ compositeOrderId });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: `Duplicate order found with ID: ${orderId} for this user.`,
      });
    }

    // Create and save shipment/order
    const shipment = new Order({
      userId,
      orderId,
      pickupAddress,
      receiverAddress,
      productDetails,
      packageDetails,
      paymentDetails,
      compositeOrderId,
      status: "new",
      channel: "api",
      channelId: shipmentId, 
      // commodityId,
      tracking: [
        {
          status: "Created",
          StatusDateTime: new Date(),
          Instructions: "Order created",
        },
      ],
    });

    await shipment.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: {
        orderId: shipment.orderId,
        clientOrderId: shipmentId,
        status: shipment.status,
      },
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = orderCreationController;
