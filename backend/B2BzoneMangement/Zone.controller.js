const express = require("express");
const router = express.Router();
const Zone = require("../models/Zone.model");
const B2Bcourier=require("../models/B2Bcourier");
const B2BCourierService=require("../models/B2BcourierService");

router.post("/createZone", async (req, res) => {
  try {
    const { name, fullname } = req.body;

    const existingZone = await Zone.findOne({
      $or: [{ name: name }, { fullname: fullname }]
    });

    if (existingZone) {
      
      const updatedZone = await Zone.findOneAndUpdate(
        { _id: existingZone._id }, 
        req.body,                   
        { new: true }               
      );

      return res.status(200).json({
        success: true,
        message: "Zone updated successfully.",
        data: updatedZone
      });
    }

    // If no existing zone, create a new one
    const newZone = new Zone(req.body);
    const savedZone = await newZone.save();

    res.status(201).json({
      success: true,
      message: "Zone created successfully.",
      data: savedZone
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating or updating the zone.",
      error: err.message
    });
  }
});



router.get("/getAllZones", async (req, res) => {
  try {
    const result = await Zone.find({});
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving zones:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
});


router.get("/getAllCourierProviders",async(req,res)=>{
  try{
    const result=await B2Bcourier.find({});
    res.status(200).json(result);
  }catch(error){
    console.error("Error retrieving zones:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})



router.get("/", async (req, res) => {
  try {
      let { provider } = req.query;
      const query = provider ? { provider: provider } : {};
      let services = await B2Bcourier.find(query).populate('services');
      res.status(200).json(services);
  } catch (error) {
      console.error("Error fetching courier services:", error);
      res.status(500).json([]);
  }
});

router.post("/saveZoneMapping", async (req, res) => {
  let { courierProviderName, courierServiceName, zone, cities, states } = req.body;

  try {
    const currService = await B2BCourierService.findOne({ courierProviderServiceName: courierServiceName });
    const currZone = await Zone.findOne({ name: zone });

    if (!currZone || !currService) {
      return res.status(404).json({ error: "Unable to create or update the zone or service" });
    }

    const existingCities = new Set(currZone.cities.map(city => city.toLowerCase()));
    const existingStates = new Set(currZone.states.map(state => state.toLowerCase()));

    cities.forEach((city) => {
      if (!existingCities.has(city.toLowerCase())) {
        currZone.cities.push(city); 
      }
    });

    states.forEach((state) => {
      if (!existingStates.has(state.toLowerCase())) {
        currZone.states.push(state); 
      }
    });

    await currZone.save();

    if (!currService.zones.includes(currZone._id)) {
      currService.zones.push(currZone._id);
    }

    await currService.save();

    return res.status(200).json({ message: "Zone mapping saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
