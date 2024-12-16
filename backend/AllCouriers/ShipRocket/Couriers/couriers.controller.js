require('dotenv').config(); 

const axios = require('axios');
const mongoose = require("mongoose");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const { getToken } = require("../Authorize/shiprocket.controller");
const { getUniqueId } = require("../../getUniqueId");


const dburl =process.env.MONGODB_URI;
mongoose.connect(dburl, {})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Connection error', err);
    });



const getAllActiveCourierServices = async (req, res) => {
    try {
        // Get the authentication token
        const token = await getToken();

        // Define request options
        const options = {
            method: "GET",
            url: "https://apiv2.shiprocket.in/v1/external/courier/courierListWithCounts?type=active",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        // Make the API request
        const response = await axios.request(options);

        if (response.status === 200) {
            const servicesData = response.data;
            // console.log(servicesData)
            // Fetch current courier and existing services
            const currCourier = await Courier.findOne({ provider: 'Shiprocket' });
            // console.log(currCourier)
            if (!currCourier) {
                return res.status(404).send("Courier provider 'Shiprocket' not found.");
            }

            const existingServices = await Services.find({ '_id': { $in: currCourier.services } });
            const prevServicesSet = new Set(existingServices.map(service => service.courierProviderServiceName));

            const newServices = []; // To track newly added services
            const errors = []; // To track errors while saving services

            // Iterate over the fetched services
            for (const element of servicesData) {
                const name = element.name;
                if (!prevServicesSet.has(name)) {
                    try {
                        const newService = new Services({
                            courierProviderServiceId: getUniqueId(),
                            courierProviderServiceName: name,
                        });
                        currCourier.services.push(newService._id);
                        await newService.save();
                        newServices.push(name);
                    } catch (error) {
                        errors.push({ name, error: error.message });
                    }
                }
            }

            // Save updated courier data
            await currCourier.save();

            // Send the response with new services and any errors
            return res.status(200).send({
                message: "Service update completed.",
                newServices,
                errors,
            });
        } else {
            return res.status(response.status).send({
                message: "Failed to fetch courier services from Shiprocket.",
                details: response.data,
            });
        }
    } catch (error) {
        console.error("Error fetching couriers:", error);
        return res.status(500).send({
            message: "Error fetching courier services.",
            error: error.response?.data || error.message,
        });
    }
};














// const getCourierServicesFromDatabase = async (req, res) => {
//     try {
//         if (!currCourier || !currCourier[0]?.services || currCourier[0].services.length === 0) {
//             return res.status(400).json({
//                 message: "Invalid request: No courier services provided.",
//             });
//         }

//         const response = await Services.find({
//             '_id': { $in: currCourier[0].services },
//         }).populate('services');

//         res.status(200).json(response);
//     } catch (error) {
//         console.error("Failed to fetch courier services from the database:", error);
//         res.status(500).json({
//             message:
//                 "Failed to fetch courier services from the database. Please try again later.",
//         });
//     }
// };


module.exports = {
    getAllActiveCourierServices
};