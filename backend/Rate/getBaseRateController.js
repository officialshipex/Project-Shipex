const BaseRateCard = require("../models/baseRateCard");

const getBaseRates = async (req, res) => {
    try {
        let result = await BaseRateCard.find({});
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching base rates", error });
    }
};

module.exports={getBaseRates};

