const axios = require('axios');
const mongoose = require("mongoose");
const Courier = require("../../../models/courierSecond");
const Services = require("../../../models/courierServiceSecond");
const { getAuthToken } = require("../Authorize/nimbuspost.controller");
const { getUniqueId } = require("../../getUniqueId");

const dburl = 'mongodb+srv://foundershipex:DEIMTVquekhDVFvc@cluster0.docbi.mongodb.net/zipping?retryWrites=true&w=majority';
mongoose.connect(dburl, {})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Connection error', err);
    });




const getCouriers = async () => {
    const url = 'https://api.nimbuspost.com/v1/courier';

    try {
        const token = await getAuthToken();
        console.log('Retrieved Token:', token);

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            let servicesData = response.data.data;
            let currCourier = await Courier.find({ provider: 'NimbusPost' });

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
                        const Nimb=await Courier.find({provider:'NimbusPost'});
                        Nimb.services.push(newService._id);
                        await newService.save();
                        await Nimb.save();
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



const getServiceablePincodes = async (req, res) => {

    const{pincode}=req.body;

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
            let fetchedData=response.data.data;
            let info={};
            for(d of fetchedData){
                if(d.pincode==pincode){
                    info.cod=d.cod;
                    info.prepaid=d.prepaid;
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

module.exports = {
    getServiceablePincodes,getCouriers
};







