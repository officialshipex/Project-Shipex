const Courier=require("../models/couriers");
const CourierServices=require("../models/courierServices");
const RateCard=require("../models/rateCards");

const saveRate=async(req,res)=>{
    const provider = await Courier.find({ provider: req.body.provider });
    const service = await CourierServices.find({ courierProviderServiceName: req.body.courierService });
    const rcard = new RateCard({
      courierProviderName: req.body.provider,
      courierServiceName: req.body.courierService,
      courierProviderId: provider[0]._id,
      courierServiceId: service[0]._id,
      weightPriceBasic: {
        weight: req.body.weightBasic,
        zoneA: req.body.zonesBasic.zoneA,
        zoneB: req.body.zonesBasic.zoneB,
        zoneC: req.body.zonesBasic.zoneC,
        zoneD: req.body.zonesBasic.zoneD,
        zoneE: req.body.zonesBasic.zoneE,
      },
      weightPriceAdditional: {
        weight: req.body.weightAdditional,
        zoneA: req.body.zonesAdditional.zoneA,
        zoneB: req.body.zonesAdditional.zoneB,
        zoneC: req.body.zonesAdditional.zoneC,
        zoneD: req.body.zonesAdditional.zoneD,
        zoneE: req.body.zonesAdditional.zoneE,
      },
      codPercent: req.body.codPercent,
      codCharge: req.body.codCharge,
      gst: req.body.gst
    });
  
    try {
      const savedRateCard = await rcard.save();
      await CourierServices.updateOne({ courierProviderServiceName: req.body.courierService }, { $push: { rateCards: savedRateCard } });
      res.status(201).json(savedRateCard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving Rate Card' });
    }
}


module.exports={saveRate};