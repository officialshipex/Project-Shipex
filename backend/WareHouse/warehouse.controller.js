const WareHouse = require("../models/wareHouse.model");

const createWareHouse = async (req, res) => {
    try {
        const data = req.body;
        const existingWareHouse = await WareHouse.findOne({
            addressLine1: data.addressLine1,
            city: data.city,
            state: data.state
        });

        if (existingWareHouse) {
            return res.status(400).json({ message: "Warehouse with the same name and address already exists." });
        }

        const newWareHouse = new WareHouse(data);
        await newWareHouse.save();
        res.status(201).json({ message: "Warehouse has been successfully saved." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createWareHouse };
