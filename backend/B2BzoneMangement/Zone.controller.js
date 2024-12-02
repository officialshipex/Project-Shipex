const express = require("express");
const router = express.Router();
const Zone = require("../models/Zone.model");
const B2Bcourier = require("../models/B2Bcourier");
const B2BCourierService = require("../models/B2BcourierService");
const ZoneMapData = require("../models/ZoneMapData.model");

router.post("/createZone", async (req, res) => {
  try {
    const { name } = req.body;

    const existingZone = await Zone.findOne({ name });


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


router.get("/getAllCourierProviders", async (req, res) => {
  try {
    const result = await B2Bcourier.find({});
    res.status(200).json(result);
  } catch (error) {
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


router.get("/getTableData", async (req, res) => {
  const data = {};

  try {
    const allB2BCouriers = await B2Bcourier.find({})
      .populate({ path: 'services', populate: { path: 'zones' } });

    for (const courier of allB2BCouriers) {
      const name = courier.provider;
      data[name] = { services: [] };

      for (const service of courier.services) {
        if (service.zones.length > 0) {
          data[name].services.push(service);
        }
      }

      if (data[name].services.length <= 0) {
        delete data[name];
      }
    }


    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});


router.post("/uploadRates", async (req, res) => {
  try {
    const data = req.body.data;
    const serviceId = req.body.service._id;
    const structuredData = [];


    for (let d of data) {
      const newData = { distances: {} };

      Object.keys(d).forEach(key => {
        if (key === 'zone') {
          newData.zone = d[key];
        } else {
          newData.distances[key] = d[key];
        }
      });

      structuredData.push(newData);
    }

    const courierService = await B2BCourierService.findById(serviceId);

    if (!courierService) {
      return res.status(404).json({ message: "Courier service not found" });
    }

    for (let sd of structuredData) {
      const newSd = new ZoneMapData(sd);
      const result = await newSd.save();
      courierService.zoneSheet.push(result._id);
    }
    await courierService.save();
    res.status(201).json({ message: "Rates uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




router.get("/getAllServices", async (req, res) => {
  try {
    const services = await B2BCourierService.find({}).populate("zones").populate("zoneSheet"); 
    res.status(201).json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services." });
  }
});


module.exports = router;
