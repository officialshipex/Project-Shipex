const EDDMap = require("../models/EDDMap.model");
const Courier = require("../models/AllCourierSchema");
const CourierService=require("../models/CourierService.Schema")

const getAllCourier = async (req, res) => {
  try {
    const courier = await Courier.find();
    res.json(courier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCourierService = async (req, res) => {
  try {
    const courierService = await CourierService.find();
    res.json(courierService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
const getAllEddMap = async (req, res) => {
  try {
    const rates = await EDDMap.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new
const addEDD = async (req, res) => {
  try {
    const rate = new EDDMap(req.body);
    await rate.save();
    res.status(201).json(rate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit
const updateEDD = async (req, res) => {
  try {
    const { id } = req.params;
    const rate = await EDDMap.findByIdAndUpdate(id, req.body, { new: true });
    res.json(rate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
const deleteEDD = async (req, res) => {
  try {
    const { id } = req.params;
    await EDDMap.findByIdAndDelete(id);
    res.json({ message: "Rate deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCourier,getAllCourierService,getAllEddMap, addEDD, updateEDD, deleteEDD };
