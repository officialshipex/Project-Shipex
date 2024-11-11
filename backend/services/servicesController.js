const Courier=require("../models/couriers");

const getServices=async(req,res)=>{
    const { provider } = req.query;

    if (!provider) {
      return res.status(400).json({ services: [{ services: [{ courierProviderServiceName: 'Select Courier Service' }] }] });
    }
  
    try {
      const couriers = await Courier.find({ provider }).populate('services');
      res.json({ services: couriers });
    } catch (error) {
      console.error('Error fetching courier services:', error);
      res.status(500).json({ error: 'Error fetching courier services' });
    }
}

module.exports={getServices};