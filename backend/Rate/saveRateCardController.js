const CourierSecond = require("../models/courierSecond");
const CourierServiceSecond = require("../models/courierServiceSecond.model");
const RateCard = require("../models/rateCards");
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');


const saveRate = async (req, res) => {
  try {
    const { type, courierProviderName, mode, courierServiceName, weightPriceBasic, weightPriceAdditional, codPercent, codCharge } = req.body;

    const existingRateCard = await RateCard.findOne({
      type,
      mode,
      courierProviderName,
      courierServiceName
    });

    if (existingRateCard) {
      existingRateCard.weightPriceBasic = weightPriceBasic;
      existingRateCard.weightPriceAdditional = weightPriceAdditional;
      existingRateCard.codPercent = codPercent;
      existingRateCard.codCharge = codCharge;
      existingRateCard.mode = mode;

      const updatedRateCard = await existingRateCard.save();

      res.status(201).json({ message: `${type} ratecard has been updated successfully for service ${courierServiceName} under provide ${courierProviderName}` });
    } else {
      const rcard = new RateCard({
        type,
        mode,
        courierProviderName,
        courierServiceName,
        weightPriceBasic,
        weightPriceAdditional,
        codPercent,
        codCharge,
        defaultRate: true
      });

      const savedRateCard = await rcard.save();

      await CourierServiceSecond.updateOne(
        { courierProviderServiceName: courierServiceName },
        { $push: { rateCards: savedRateCard } }
      );

      res.status(201).json({ message: `${type} ratecard has been added successfully for service ${courierServiceName} under provide ${courierProviderName}` });

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving or updating Rate Card' });
  }
};



const uploadRate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      console.log(data);

      let parsedData;
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).send('Invalid JSON data.');
      }

      const { courierProviderName, type } = parsedData;
      let service = '';
      let mode = 'Surface';

      const existingCourier = await CourierSecond.find({ provider: courierProviderName }).populate('services');
      const existingServices = existingCourier.flatMap(courier => 
        courier.services.map(service => service.courierProviderServiceName.replace(/\s+/g, "").toLowerCase())
      );
      console.log(existingServices);

      for (const item of data) {
        if (item.Courier) {
          service = item.Courier;
          mode = item.mode || mode;

          const lowercaseCurrService = service.replace(/\s+/g, "").toLowerCase();
          console.log(lowercaseCurrService);

          if (existingServices.includes(lowercaseCurrService)) {
           
            const existingRateCard = await RateCard.findOne({
              type,
              mode,
              courierProviderName,
              courierServiceName: service,
            });

            const transformedData = [{
              weight: parseFloat(item.Weight),
              zoneA: { forward: item['Zone A Forward'], rto: item['Zone A RTO'] },
              zoneB: { forward: item['Zone B Forward'], rto: item['Zone B RTO'] },
              zoneC: { forward: item['Zone C Forward'], rto: item['Zone C RTO'] },
              zoneD: { forward: item['Zone D Forward'], rto: item['Zone D RTO'] },
              zoneE: { forward: item['Zone E Forward'], rto: item['Zone E RTO'] },
            }];

            if (existingRateCard) {
              existingRateCard.weightPriceBasic = transformedData;
              existingRateCard.codPercent = item['COD %'];
              existingRateCard.codCharge = item['COD Charge'];
              existingRateCard.mode = mode;

              console.log("----------------------------");
              console.log("This is existing RateCard");
              console.log(existingRateCard);
              console.log("----------------------------");
              // await existingRateCard.save();
            } else {
              const rcard = new RateCard({
                type,
                mode,
                courierProviderName,
                courierServiceName: service,
                weightPriceBasic: transformedData,
                codPercent: item['COD %'],
                codCharge: item['COD Charge'],
                defaultRate: true,
              });

              console.log("----------------------------");
              console.log("This is new RateCard");
              console.log(rcard);
              console.log("----------------------------");
              const savedRateCard = await rcard.save();

              console.log("----------------------------");
              console.log("This is new RateCard");
              console.log(savedRateCard);
              console.log("----------------------------");

              await CourierServiceSecond.updateOne(
                { courierProviderServiceName: service },
                { $push: { rateCards: savedRateCard } }
              );
            }

            continue;
          }
        } else{
          const transformedData = [{
            weight: parseFloat(item.Weight.replace(/[^\d.-]/g, '')),
            zoneA: { forward: item['Zone A Forward'], rto: item['Zone A RTO'] },
            zoneB: { forward: item['Zone B Forward'], rto: item['Zone B RTO'] },
            zoneC: { forward: item['Zone C Forward'], rto: item['Zone C RTO'] },
            zoneD: { forward: item['Zone D Forward'], rto: item['Zone D RTO'] },
            zoneE: { forward: item['Zone E Forward'], rto: item['Zone E RTO'] },
          }];

          const existingRateCard = await RateCard.findOne({
            type,
            mode,
            courierProviderName,
            courierServiceName: service,
          });

          if (existingRateCard) {
            existingRateCard.weightPriceAdditional = transformedData;
            const updatedRateCard = await existingRateCard.save();
            console.log("----------------------------");
            console.log("Updated RateCard with additional weight price");
            console.log(updatedRateCard);
            console.log("----------------------------");
          }
        }
      }

      fs.unlinkSync(filePath);

      res.status(201).json('File uploaded and data saved successfully.');

    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json('Error processing file.');
    }
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json('An unexpected error occurred.');
  }
};





module.exports = { saveRate, uploadRate };