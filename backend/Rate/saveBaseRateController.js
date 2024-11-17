const BaseRateCard = require("../models/baseRateCard");

const saveBaseRate = async (req, res) => {
  try {
    const newRateCard = new BaseRateCard(req.body);
    await newRateCard.save();
    const result = await BaseRateCard.find({});
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving base rate card:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { saveBaseRate };
