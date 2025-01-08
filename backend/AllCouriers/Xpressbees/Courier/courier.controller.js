const axios = require('axios');
const mongoose = require("mongoose");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond.model");
const { getAuthToken } = require("../Authorize/XpressbeesAuthorize.controller");
const { getUniqueId } = require("../../getUniqueId");


const getCourierList = async (req, res) => {
    const url = 'https://shipment.xpressbees.com/api/courier';

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
            const currCourier = await Courier.findOne({ provider: 'Xpressbees' }).populate('services');
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




const addService = async (req, res) => {
    try {
        

        const currCourier = await Courier.findOne({ provider: 'Xpressbees' });

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
                courierProviderName:'Xpressbees',
                provider_courier_id
            });

            const Xpress = await Courier.findOne({ provider:'Xpressbees' });
            Xpress.services.push(newService._id);

            await newService.save();
            await Xpress.save();

            console.log(`New service saved: ${name}`);

            return res.status(201).json({ message: `${name} has been successfully added` });
        }

        return res.status(400).json({ message: `${name} already exists` });
    } catch (error) {
        console.error(`Error adding service: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



    module.exports={
        getCourierList,addService
    }


     // if (response.data.status) {
            //     let servicesData = response.data.data;
            //     let currCourier = await Courier.find({ provider: 'Xpressbees' });
    
            //     // Fetch all previous services in a single query to reduce DB calls
            //     const prevServices = new Set();
            //     const services = await Services.find({ '_id': { $in: currCourier[0].services } });
                
            //     // Populate Set with previous service names
            //     services.forEach(service => {
            //         prevServices.add(service.courierProviderServiceName);
            //     });
    
            //     // Loop through new services and check if they already exist
            //     servicesData.forEach(async (element) => {
            //         let name = element.name;
            //         if (!prevServices.has(name)) {
            //             try {
            //                 const newService = new Services({
            //                     courierProviderServiceId: getUniqueId(),
            //                     courierProviderServiceName: name,
            //                 });
            //                 const xpressbeesNewService=await Courier.find({provider:'Xpressbees'});
            //                 xpressbeesNewService.services.push(newService._id);
            //                 await newService.save();
            //                 await xpressbeesNewService.save();
            //                 console.log(`New service saved: ${name}`);
            //             } catch (error) {
            //                 console.error(`Error saving service: ${name}`, error);
            //             }
            //         }
            //     });
            // }