const CourierSecond=require("../models/courierSecond");
const CourierServiceSecond=require("../models/courierServiceSecond");
const RateCard=require("../models/rateCards");

const saveRate=async(req,res)=>{

 try {
    const rcard = new RateCard({
      courierProviderName: req.body.courierProviderName,
      courierServiceName: req.body.courierServiceName,
      weightPriceBasic:req.body.weightPriceBasic,
      weightPriceAdditional:req.body.weightPriceAdditional,
      codPercent: req.body.codPercent,
      codCharge: req.body.codCharge,
      defaultRate:true
    });
    console.log(rcard);
      const savedRateCard = await rcard.save();
      await CourierServiceSecond.updateOne({ courierProviderServiceName: req.body.courierServiceName}, { $push: { rateCards: savedRateCard } });
      res.status(201).json(savedRateCard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving Rate Card' });
    }
}


module.exports={saveRate};