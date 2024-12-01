const axios = require('axios');
const mongoose = require("mongoose");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond");
const { getAuthToken } = require("../Authorize/XpressbeesAuthorize.controller");
const { getUniqueId } = require("../../getUniqueId");

    const getCourierList = async () => {
        const url = 'https://shipment.xpressbees.com/api/courier';
    
        try {
            const token = await getAuthToken();
            console.log('Retrieved Token xpressbees :', token);
    
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (response.data.status) {
                let servicesData = response.data.data;
                let currCourier = await Courier.find({ provider: 'Xpressbees' });
    
                // Fetch all previous services in a single query to reduce DB calls
                const prevServices = new Set();
                const services = await Services.find({ '_id': { $in: currCourier[0].services } });
                
                // Populate Set with previous service names
                services.forEach(service => {
                    prevServices.add(service.courierProviderServiceName);
                });
    
                // Loop through new services and check if they already exist
                servicesData.forEach(async (element) => {
                    let name = element.name;
                    if (!prevServices.has(name)) {
                        try {
                            const newService = new Services({
                                courierProviderServiceId: getUniqueId(),
                                courierProviderServiceName: name,
                            });
                            const xpressbeesNewService=await Courier.find({provider:'Xpressbees'});
                            xpressbeesNewService.services.push(newService._id);
                            await newService.save();
                            await xpressbeesNewService.save();
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

    module.exports={
        getCourierList
    }