const express = require("express");
const router = express.Router();
const Zone = require("../models/Zone.model");

// router.post("/createZone", async (req, res) => {
//   try {
//     const { name, fullname } = req.body;

//     const existingZone = await Zone.findOne({
//       $or: [{ name: name }, { fullname: fullname }]
//     });

//     if (existingZone) {
//       return res.status(400).json({
//         success: false,
//         message: "Zone Has Been Updated Succefully."
//       });
//     }

//     const newZone = new Zone(req.body);
//     const savedZone = await newZone.save();

//     res.status(201).json({
//       success: true,
//       message: "Zone created successfully.",
//       data: savedZone
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the zone.",
//       error: err.message
//     });
//   }
// });


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

module.exports = router;
