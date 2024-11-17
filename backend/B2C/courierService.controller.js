// import axios from "axios";
const axios = require("axios")
// import CourierService from "../models/courierServiceB2C.model";
const CourierService = require("../models/courierServiceB2C.model")

const getAllActiveCourierServices = async (req, res) => {
    const { provider, token } = req.body;
    console.log(provider)
    try {
        switch (provider) {
            case "shiprocket":
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
                    // console.log(response?.data);
                    res.status(200).json(response?.data);
                } catch (error) {
                    res.status(500).json({
                        message: "Failed to Fetch Courier Services. Server Side Error",
                        error: error.message,
                    });
                }
                break;

            default:
                res.status(400).json({ message: "Provider not found" });
                break;
        }
    } catch (error) {
        res.status(500).json({
            message: "Courier Services not found Enternal Server Error",
            error: error.message,
        });
    }
};

const saveCourierServiceDataInDatabase = async (req, res) => {
    const {
        courierProvider,
        courierProviderId,
        courierProviderServiceName,
        name,
        courierType,
    } = req.body;

    try {
        const result = await CourierService.findOneAndUpdate(
            { courierProviderId, name },
            {
                courierProvider,
                courierProviderId,
                courierProviderServiceName,
                name,
                courierType,
            },
            { new: true, upsert: true }
        );
        res
            .status(200)
            .json({ message: "Courier Service store in database successfully" });
        return result;
    } catch (error) {
        res
            .status(500)
            .json({
                message:
                    "Something went wrong to store Courier Service in database. Please try again after some time later.",
            });
        throw new Error("Failed to save Credentials in Database:" + error?.message);
    }
};

const getCourierServicesFromDatabase = async (req, res) => {
    try {
        const response = await CourierService.find();
        res.status(200).json(response);
    } catch (error) {
        res
            .status(500)
            .json({
                message:
                    "Failed to Get the data of CourierServices From Database. Please try again after some time later.",
            });
        throw new Error(
            "Failed to Get the data of CourierServices From Database:" +
            error?.message
        );
    }
};

module.exports = {
    getAllActiveCourierServices,
    saveCourierServiceDataInDatabase,
    getCourierServicesFromDatabase,
};
