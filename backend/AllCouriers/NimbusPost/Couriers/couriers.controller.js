require('dotenv').config();

const axios = require('axios');
const mongoose = require("mongoose");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const { getAuthToken } = require("../Authorize/nimbuspost.controller");
const { getUniqueId } = require("../../getUniqueId");

// const dburl =process.env.MONGODB_URI;
// mongoose.connect(dburl, {})
//     .then(() => {
//         console.log('Connected to MongoDB Atlas');
//     })
//     .catch((err) => {
//         console.error('Connection error', err);
//     });


const getCouriers = async (req, res) => {
    const url = 'https://api.nimbuspost.com/v1/courier';

    try {
        const token = await getAuthToken();
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            const servicesData = response.data.data;
            const currCourier = await Courier.findOne({ provider: 'NimbusPost' }).populate('services');
            const prevServices = new Set(currCourier.services.map(service => service.courierProviderServiceName));
           

            const allServices = servicesData.map(element => ({
                service: element.name,
                provider_courier_id:element.id,
                isAdded: prevServices.has(element.name)
            }));

            return res.status(201).json(allServices);
        }

        res.status(400).json({ message: 'Failed to fetch services' });

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch couriers', details: error.message });
    }
};



// if (response.data.status) {
//     let servicesData = response.data.data;
//     let currCourier = await Courier.find({ provider: 'NimbusPost' });


//     const prevServices = new Set();
//     const services = await Services.find({ '_id': { $in: currCourier[0].services } });


//     services.forEach(service => {
//         prevServices.add(service.courierProviderServiceName);
//     });


// //     servicesData.forEach(async (element) => {
// //         let name = element.name;
// //         if (!prevServices.has(name)) {
// //             try {
// //                 const newService = new Services({
// //                     courierProviderServiceId: getUniqueId(),
// //                     courierProviderServiceName: name,
// //                 });
// //                 const Nimb=await Courier.find({provider:'NimbusPost'});
// //                 Nimb.services.push(newService._id);
// //                 await newService.save();
// //                 await Nimb.save();
// //                 console.log(`New service saved: ${name}`);
// //             } catch (error) {
// //                 console.error(`Error saving service: ${name}`, error);
// //             }
// //         }
// //     });
// }

const addService = async (req, res) => {
    try {
        

        const currCourier = await Courier.findOne({ provider: 'NimbusPost' });

        const prevServices = new Set();
        const services = await Services.find({ '_id': { $in: currCourier.services } });

        services.forEach(service => {
            prevServices.add(service.courierProviderServiceName);
        });

        const name = req.body.service;
        const provider_courier_id=req.body.provider_courier_id;

        if (!prevServices.has(name)) {
            const newService = new Services({
                courierProviderServiceId: getUniqueId(),
                courierProviderServiceName: name,
                courierProviderName:'NimbusPost',
                provider_courier_id,
            });

            const Nimb = await Courier.findOne({ provider: 'NimbusPost' });
            Nimb.services.push(newService._id);

            await newService.save();
            await Nimb.save();

            console.log(`New service saved: ${name}`);

            return res.status(201).json({ message: `${name} has been successfully added` });
        }

        return res.status(400).json({ message: `${name} already exists` });
    } catch (error) {
        console.error(`Error adding service: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



const getServiceablePincodes = async (req, res) => {

    const { pincode } = req.body;

    const url = 'https://api.nimbuspost.com/v1/courier/serviceability';

    try {
        const token = await getAuthToken();

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.status) {
            let fetchedData = response.data.data;
            let info = {};
            for (d of fetchedData) {
                if (d.pincode == pincode) {
                    info.cod = d.cod;
                    info.prepaid = d.prepaid;
                    break;
                }
            }
            return res.status(200).json(info);
        } else {
            return res.status(400).json({ error: 'Error in fetching serviceable pincodes', details: response.data });
        }
    } catch (error) {
        console.error('Error in fetching serviceable pincodes:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

const getServiceablePincodesData = async (service, payload) => {
    const url = 'https://api.nimbuspost.com/v1/courier/serviceability';

    try {
        const token = await getAuthToken();

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.status) {
            console.log("I am in nimbuspost services");
            console.log(response.data.data);
            const filteredData = response.data.data.filter((item) => item.name === service);
            return filteredData.length > 0;
        } else {
            throw new Error('Error in fetching serviceable pincodes');
        }
    } catch (error) {
        console.error('Error in fetching serviceable pincodes:', error.response?.data || error.message);
        throw new Error(error.response?.data || error.message); 
    }
};



module.exports = {
    getServiceablePincodes, getCouriers, getServiceablePincodesData, addService
};







