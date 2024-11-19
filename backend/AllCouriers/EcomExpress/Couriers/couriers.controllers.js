const axios = require('axios');
const FormData = require('form-data');

const checkServiceability = async (req, res) => {
    const { originPincode, destinationPincode } = req.body;

    if (!originPincode || !destinationPincode) {
        return res.status(400).json({ error: 'Origin and destination pincodes are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/services/expp/expppincode/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('origin_pincode', originPincode);
    formData.append('destination_pincode', destinationPincode);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};


const fetchAWB = async (req, res) => {
    const { count, type } = req.body;

    if (!count || !type) {
        return res.status(400).json({ error: 'count, and type are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/services/shipment/products/v2/fetch_awb';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('count', count);
    formData.append('type', type);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};


const createManifest = async (req, res) => {
    const { jsonInput } = req.body;

    if (!jsonInput) {
        return res.status(400).json({ error: 'json_input is required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/services/expp/manifest/v2/expplus';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('json_input', JSON.stringify(jsonInput));

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const getPincodes = async (req, res) => {

    const url = 'https://clbeta.ecomexpress.in/apiv2/pincodes/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const getPincodeDetails = async (req, res) => {
    const { pincode } = req.body;

    if (!pincode) {
        return res.status(400).json({ error: 'pincode are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/apiv3/pincode/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('pincode', pincode);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};


// FORWARD JOURNEY
const createManifestAWBforward = async (req, res) => {
    const { jsonInput } = req.body;

    if (!jsonInput) {
        return res.status(400).json({ error: 'json_input are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/apiv2/manifest_awb/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('json_input', JSON.stringify(jsonInput));

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const cancelShipmentforward = async (req, res) => {
    const { awbs } = req.body;

    if (!awbs) {
        return res.status(400).json({ error: 'AWB numbers are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/apiv2/cancel_awb/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('awbs', awbs);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const shipmentTrackingforward = async (req, res) => {
    const { awb } = req.body;

    if (!awb) {
        return res.status(400).json({ error: 'AWB number is required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/track_me/api/mawbd/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('awb', awb);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};


// REVERSE JOURNEY
const manifestAwbRev = async (req, res) => {
    const { json_input } = req.body;

    if (!json_input) {
        return res.status(400).json({ error: 'json_input is required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/apiv2/manifest_awb_rev_v2/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('json_input', JSON.stringify(json_input));

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};



const cancelShipmentRev = async (req, res) => {
    const { awbs } = req.body;

    if (!awbs) {
        return res.status(400).json({ error: 'AWB number(s) are required.' });
    }

    const url = 'https://clbeta.ecomexpress.in/apiv2/cancel_awb/';
    const formData = new FormData();
    formData.append('username', process.env.ECOM_GMAIL);
    formData.append('password', process.env.ECOM_PASS);
    formData.append('awbs', awbs);

    try {
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};



const shipmentTrackingRev = async (req, res) => {
    const { awb } = req.query;

    if (!awb) {
        return res.status(400).json({ error: 'AWB number is required.' });
    }

    const url = `https://clbeta.ecomexpress.in/track_me/api/mawbd/?username=${process.env.ECOM_GMAIL}&password=${process.env.ECOM_PASS}&awb=${awb}`;

    try {
        const response = await axios.get(url);
        res.status(200).json({ data: response.data });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status || 500).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};








module.exports = {
    checkServiceability,
    fetchAWB,
    createManifest,
    getPincodes,
    getPincodeDetails,
    createManifestAWBforward,
    cancelShipmentforward,
    shipmentTrackingforward,
    manifestAwbRev,
    cancelShipmentRev,
    shipmentTrackingRev
};





