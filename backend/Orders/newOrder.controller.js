const Order = require('../models/newOrder.model'); // Adjust the path to your model
const user=require('../models/User.model');
const pickAddress=require('../models/pickupAddress.model');
const receiveAddress=require('../models/deliveryAddress.model');

// Create a shipment
const newOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      receiverAddress,
      packageDetails,
      paymentDetails,
      prodectDetails // Fix typo to productDetails
    } = req.body;

    // Validate request data
    if (!pickupAddress || !receiverAddress || !packageDetails || !paymentDetails || !prodectDetails) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(prodectDetails) || prodectDetails.length === 0) {
      return res.status(400).json({ error: 'Product details must be a non-empty array' });
    }

    if (!['COD', 'Prepaid'].includes(paymentDetails.method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Generate a unique six-digit order ID
    let orderId;
    let isUnique = false;

    while (!isUnique) {
      orderId = Math.floor(100000 + Math.random() * 900000); // Generates a random six-digit number
      const existingOrder = await Order.findOne({ orderId });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    // Save pickup address
    const pickup = new pickAddress({
      userId: req.user._id,
      pickupAddress,
    });
    await pickup.save();

    // Save receiver address
    const receiver = new receiveAddress({
      userId: req.user._id,
      receiverAddress,
    });
    await receiver.save();

    // Create a new shipment
    const shipment = new Order({
      userId: req.user._id,  
      orderId,
      pickupAddress,
      receiverAddress,
      packageDetails,
      paymentDetails,
      productDetails: prodectDetails, // Store product details correctly
      status: 'new',
    });

    // Save to the database
    await shipment.save();

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getOrders = async (req, res) => {
  try {
    // console.log(req.user._id)
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getpickupAddress = async (req, res) => {
  try {
    const pickup = await pickAddress.find({ userId: req.user._id });
    res.json(pickup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getreceiverAddress = async (req, res) => {
  try {
    const receiver = await receiveAddress.find({ userId: req.user._id });
    res.json(receiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { newOrder, getOrders,getpickupAddress,getreceiverAddress };
