const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const { fileURLToPath } = require('url');
const Service = require("../models/B2BcourierService");

let Info = {};

const getCities = async (ServiceName) => {
    try {
        const service = await Service.findOne({ courierProviderServiceName: ServiceName }).populate('zones');

        if (!service) {
            console.error('Service not found');
            return;
        }

        const zones = service.zones;

        for (let zone of zones) {

            Info[zone] = { cities: [], states: [] };

            // Add cities
            for (let city of zone.cities) {
                Info[zone].cities.push(city);
            }

            // Add states
            for (let state of zone.states) {
                Info[zone].states.push(state);
            }
        }

        console.log('Fetched cities and states:', Info);
    } catch (error) {
        console.error('Error fetching cities and states:', error);
    }
};


let pinCodeData = {};

const getpinCodeData = async () => {
    const csvFilePath = path.join(__dirname, "../data/pincodes.csv");

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on("data", (row) => {
                if (row.pincode && row.city && row.state) {
                    const pincode = row.pincode.trim();
                    pinCodeData[pincode] = {
                        city: row.city.trim(),
                        state: row.state.trim(),
                    };
                } else {
                    console.log("Invalid CSV row:", row);
                }
            })
            .on("end", () => {
                console.log("CSV file successfully processed");
                resolve();
            })
            .on("error", (error) => {
                console.log("Error while reading CSV file", error);
                reject(error);
            });
    });
};


const getPinCodeDetails = async (pincode) => {
    console.log("Fetching PinCode data...");
    await getpinCodeData();

    pincode = pincode.trim();

    if (pinCodeData[pincode]) {
        console.log(pinCodeData[pincode]);
        return pinCodeData[pincode];
    }

    try {
        const response = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
        );

        console.log("This is the response of India post api", response.data);

        if (
            response.data &&
            response.data[0].Status === "Success" &&
            response.data[0].PostOffice.length > 0
        ) {
            const pinCodeDetails = response.data[0].PostOffice[0];
            return {
                city: pinCodeDetails.District,
                state: pinCodeDetails.State,
            };
        } else {
            console.log(`No Data found for pincode ${pincode}`);
            return null;
        }
    } catch (error) {
        console.log(
            "API request failed. Server Side Error. Please try after some time later!!",
            error
        );
        return null;
    }
};



const getZone = async (fromPinCode, toPinCode, res) => {
    await getCities(); // Ensure `Info` is populated

    if (fromPinCode?.length !== 6 || toPinCode?.length !== 6) {
        return res
            ? res.status(400).json({ message: "Please Enter valid Pincode" })
            : { error: "Please Enter valid Pincode" };
    }

    const fromPinCodeDetails = await getPinCodeDetails(fromPinCode);
    const toPinCodeDetails = await getPinCodeDetails(toPinCode);

    if (!fromPinCodeDetails || !toPinCodeDetails) {
        return res
            ? res.status(400).json({
                  message:
                      "Pincode details not found, please enter valid pincode or try again later.",
              })
            : {
                  error:
                      "Pincode details not found, please enter valid pincode or try again later.",
              };
    }

    // Normalize city names to avoid case mismatch
    let fromCity = fromPinCodeDetails.city.toLowerCase();
    let toCity = toPinCodeDetails.city.toLowerCase();

    if (fromCity.includes("delhi")) fromCity = "delhi";
    if (toCity.includes("delhi")) toCity = "delhi";

    let fromState = fromPinCodeDetails.state.toLowerCase();
    let toState = toPinCodeDetails.state.toLowerCase();

    let fromZone = null;
    let toZone = null;

    // Search for zones containing the cities
    for (const [zoneKey, zoneData] of Object.entries(Info)) {
        if (zoneData.cities.map((city) => city.toLowerCase()).includes(fromCity)) {
            fromZone = zoneKey;
        }

        if (zoneData.cities.map((city) => city.toLowerCase()).includes(toCity)) {
            toZone = zoneKey;
        }

        // Exit early if both zones are found
        if (fromZone && toZone) break;

        if (zoneData.states.map((state) => state.toLowerCase()).includes(fromState)) {
            fromZone = zoneKey;
        }

        if (zoneData.states.map((state) =>state.toLowerCase()).includes(toState)) {
            toZone = zoneKey;
        }

    }

    if (!fromZone || !toZone) {
        return res
            ? res.status(404).json({
                  message: "Zones not found for the provided pin codes.",
              })
            : { error: "Zones not found for the provided pin codes." };
    }

    // Return the zones for the provided pin codes
    const result = { fromZone, toZone };

    return result;
};


module.exports={getZone};