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
    const token = await getToken();
    try {
        const option = {
            method: "GET",
            url: "https://apiv2.shiprocket.in/v1/external/courier/courierListWithCounts?type=active",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.request(option);
        if (response.status) {
            let servicesData = response.data;
            let currCourier = await Courier.find({ provider:'Shiprocket'});

            // Fetch all previous services in a single query to reduce DB calls
            const prevServices = new Set();
            const services = await Services.find({ '_id': { $in: currCourier[0].services } });

            // Populate Set with previous service names
            services.forEach(service => {
                prevServices.add(service.courierProviderServiceName);
            });

            servicesData.forEach(async (element) => {
                let name = element.name;
                if (!prevServices.has(name)) {
                    try {
                        const newService = new Services({
                            courierProviderServiceId: getUniqueId(),
                            courierProviderServiceName: name,
                        });
                        const Ship = await Courier.find({ provider: 'Shiprocket' });
                        Ship.services.push(newService._id);
                        await newService.save();
                        await Ship.save();
                        console.log(`New service saved: ${name}`);
                    } catch (error) {
                        console.error(`Error saving service: ${name}`, error);
                    }
                }
            });

        }

    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        throw new Error(`Error in fetching couriers: ${error.message}`);
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