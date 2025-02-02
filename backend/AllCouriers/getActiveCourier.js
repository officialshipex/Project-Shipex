const AllCourier = require('../models/AllCourierSchema');

const getAllCouriers = async (req, res) => {
    try {
      const couriers = await AllCourier.find();
      res.status(200).json(couriers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getAllCouriers;