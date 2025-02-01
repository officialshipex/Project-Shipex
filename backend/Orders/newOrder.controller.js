const Order = require('../models/newOrder.model'); // Adjust the path to your model
const user=require('../models/User.model');

// Create a shipment
const newOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      receiverAddress,
      packageDetails,
      paymentDetails,
    } = req.body;

    // Validate request data
    if (!pickupAddress || !receiverAddress || !packageDetails || !paymentDetails) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['COD', 'Prepaid'].includes(paymentDetails.method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Create a new shipment
    const shipment = new Order({
      userId: req.user._id,  
      pickupAddress,
      receiverAddress,
      packageDetails,
      paymentDetails,
      status:'new'
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
    console.log(req.user._id)
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { newOrder, getOrders };
