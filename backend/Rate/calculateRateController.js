const RateCard=require("../models/rateCards.js");
const zoneManagementController=require("./zoneManagementController.js.js");
const getZone=zoneManagementController.getZone;

const calculateRate=async(req,res)=>{
    try{
        console.log(req.body);
        let result = await getZone(req.body.pickupPincode, req.body.deliveryPincode);
        let currentZone = result.zone;
        let allRates = [];
        let rateCards = await RateCard.find({});
        console.log(rateCards);
      
        // -------------------CALCULATING DEAD WEIGHT-------------------------------------
        let l = parseFloat(req.body.length);
        let b = parseFloat(req.body.breadth);
        let h = parseFloat(req.body.height);
      
      
        let deadweight = parseFloat(req.body.weight);
        let volumetricWeight = (l * b * h) / 5000;
      
        let chargedWeight = Math.max(deadweight, volumetricWeight);
      
        // ----------------------------CALCULATING COD
        let cod = 0;
        let gst = req.body.gst || 18;  // Assuming GST is passed in request body, defaulting to 18 if not provided
      
        // ----------------------------------------------------------
        for (let rc of rateCards) {
          let basicWeight = parseFloat(rc.weightPriceBasic[0].weight) / 1000;
          let additionalWeight = parseFloat(rc.weightPriceAdditional[0].weight) / 1000;
          let basicCharge = parseFloat(rc.weightPriceBasic[0][currentZone]);
          let additionalCharge = parseFloat(rc.weightPriceAdditional[0][currentZone]);
         
      
      
          let finalBasicCharge=basicCharge;
          let finalAdditionalCharge=Math.ceil((chargedWeight-basicWeight)/additionalWeight)*additionalCharge;
          let finalCharge=finalBasicCharge;
          finalCharge+=finalAdditionalCharge;
          console.log(finalCharge);
      // ---------------------------------cod--------------------------------------------------------------
      if (req.body.paymentMode === 'cod') {
        const orderValue = Number(req.body.value) || 0;
        
        if (typeof rc.codCharge === 'number' && typeof rc.codPercent === 'number') {
            let finalCod = Math.max(rc.codCharge, orderValue * (rc.codPercent / 100));
            console.log("cod",finalCod);
            cod+=finalCod;
        } else {
            console.error("COD charge or percentage is not properly defined.");
        }
      }
      
      //---------------------------cod--------------------------------------------------------------------- 
      
          let gstAmount =((finalCharge+cod) * (gst / 100)).toFixed(2);
          let totcharges=((finalCharge+cod)+(finalCharge+cod) * (gst / 100)).toFixed(2);
          allRates.push({
            service: rc.courierServiceName,
      
            charges: finalCharge,
            cod: cod,
            gst: gstAmount,
            finalCharges:totcharges
          });
      
        }
      
        console.log(allRates);
        res.status(201).json(allRates);
       }
       catch(error){
        console.log('Error in Calculation')
        res.status(500).json({error:'Error in Calculation'});
       }
      
}


module.exports={calculateRate};