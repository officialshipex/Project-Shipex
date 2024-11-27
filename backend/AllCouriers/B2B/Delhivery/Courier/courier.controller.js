require('dotenv').config({ path: "../../../../.env" });
const axios = require('axios');
const { getToken } = require("../Authorize/authorize.controller");
const fs = require('fs');
const FormData = require('form-data');

const getTatEstimate = async (req, res) => {
    const { origin_pin, destination_pin } = req.body;
    const baseURL = 'https://ltl-clients-api.delhivery.com';
    const endpoint = '/tat/estimate';
    const url = `${baseURL}${endpoint}`;


    if (!origin_pin || !destination_pin) {
        console.error("Origin and destination pins are mandatory.");
        return res.status(400).json({ success: false, error: "Missing query parameters" });
    }

    try {

        const token = await getToken();

        if (!token || !token.data) {
            console.error("Failed to fetch token.");
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token.data}`
            },
            params: {
                origin_pin,
                destination_pin,
            },
        });

        console.log("TAT Estimate Success:", response.data);
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        // Handle errors
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};



const getPincodeService = async (req, res) => {
    const { pincode } = req.params;
    const { weight } = req.query;
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = `/pincode-service/${pincode}`;
    const url = `${baseURL}${endpoint}`;

    if (!pincode) {
        console.error("Pincode is mandatory.");
        return res.status(400).json({ success: false, error: "Missing pincode parameter" });
    }

    try {

        const token = await getToken();
        if (!token || !token.data) {
            console.error("Failed to fetch token.");
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
        }


        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token.data}`,
            },
            params: { weight },
        });

        console.log("Pincode Service Success:", response.data);
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};


const createClientWarehouse = async (req, res) => {
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = '/client-warehouse/create/';
    const url = `${baseURL}${endpoint}`;

    const payload = req.body;

    if (!payload.name || !payload.pin_code || !payload.address_details) {
        console.error("Mandatory fields are missing.");
        return res.status(400).json({
            success: false,
            error: "Missing mandatory fields: 'name', 'pin_code', or 'address_details'.",
        });
    }

    try {
        const token = await getToken();
        if (!token || !token.data) {
            console.error("Failed to fetch token.");
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
        }

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Client Warehouse Created Successfully:", response.data);
        return res.status(201).json({ success: true, data: response.data });
    } catch (error) {
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};




const createPickupRequest = async (req, res) => {
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = '/pickup_requests/';
    const url = `${baseURL}${endpoint}`;

    const { client_warehouse, pickup_date, start_time, end_time, expected_package_count } = req.query;

    if (!client_warehouse || !pickup_date || !start_time || !end_time || !expected_package_count) {
        console.error("Mandatory fields are missing.");
        return res.status(400).json({
            success: false,
            error: "Missing mandatory query parameters: 'client_warehouse', 'pickup_date', 'start_time', 'end_time', or 'expected_package_count'.",
        });
    }

    try {

        const token = await getToken();
        if (!token || !token.data) {
            console.error("Failed to fetch token.");
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid" });
        }


        const headers = {
            Authorization: `Bearer ${token.data}`,
        };


        const payload = {
            client_warehouse,
            pickup_date,
            start_time,
            end_time,
            expected_package_count: parseInt(expected_package_count, 10), // Ensure it's an integer
        };


        const response = await axios.post(url, payload, { headers });

        console.log("Pickup Request Created Successfully:", response.data);
        return res.status(201).json({ success: true, data: response.data });
    } catch (error) {
        // Handle errors
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};



const deletePickupRequest = async (req, res) => {
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const { pickup_id } = req.params;

    if (!pickup_id) {
        console.error("Missing mandatory path parameter: 'pickup_id'.");
        return res.status(400).json({
            success: false,
            error: "Path parameter 'pickup_id' is required.",
        });
    }

    const url = `${baseURL}/pickup_requests/${pickup_id}`;

    try {
        const token = await getToken();
        if (!token || !token.data) {
            console.error("Failed to fetch token.");
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
        }

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token.data}`,
            },
        });

        console.log("Pickup Request Deleted Successfully:", response.data);
        return res.status(200).json({ success: true, message: "Pickup request deleted successfully." });
    } catch (error) {

        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};


const createManifest = async (req, res) => {
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = '/manifest';
    const url = `${baseURL}${endpoint}`;

    const {
        lrn,
        pickup_location_name,
        pickup_location_id,
        payment_mode,
        cod_amount,
        weight,
        dropoff_store_code,
        dropoff_location,
        return_address,
        shipment_details,
        dimensions,
        rov_insurance,
        enable_paperless_movement,
        callback,
        invoices,
    } = req.body;


    if (!payment_mode || !weight || !shipment_details || !invoices) {
        return res.status(400).json({
            success: false,
            error: "Missing mandatory parameters: 'payment_mode', 'weight', 'shipment_details', or 'invoices'.",
        });
    }


    const formData = new FormData();
    formData.append('payment_mode', payment_mode);
    formData.append('weight', weight);


    if (lrn) formData.append('lrn', lrn);
    if (pickup_location_name) formData.append('pickup_location_name', pickup_location_name);
    if (pickup_location_id) formData.append('pickup_location_id', pickup_location_id);
    if (cod_amount) formData.append('cod_amount', cod_amount);
    if (dropoff_store_code) formData.append('dropoff_store_code', dropoff_store_code);
    if (dropoff_location) formData.append('dropoff_location', JSON.stringify(dropoff_location));
    if (return_address) formData.append('return_address', JSON.stringify(return_address));
    if (dimensions) formData.append('dimensions', JSON.stringify(dimensions));
    if (rov_insurance !== undefined) formData.append('rov_insurance', rov_insurance);
    if (enable_paperless_movement !== undefined) formData.append('enable_paperless_movement', enable_paperless_movement);
    if (callback) formData.append('callback', JSON.stringify(callback));
    formData.append('shipment_details', JSON.stringify(shipment_details));
    formData.append('invoices', JSON.stringify(invoices));

    // Attach files if provided
    if (req.files && req.files.doc_file) {
        req.files.doc_file.forEach((file) => {
            formData.append('doc_file', fs.createReadStream(file.path), file.originalname);
        });
    }

    // Add authorization token
    const token = await getToken();
    if (!token || !token.data) {
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
    }

    try {
        // Make API request
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token.data}`
            },
        });

        console.log("Manifestation Success:", response.data);
        return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};




const getManifestStatus = async (req, res) => {
    const { job_id } = req.query;

    if (!job_id) {
        return res.status(400).json({
            success: false,
            error: "Missing 'job_id' in query parameters.",
        });
    }

    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = '/manifest';
    const url = `${baseURL}${endpoint}`;

    try {
        const token = await getToken();
        if (!token || !token.data) {
            return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
        }

        // Make the API request
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token.data}`,
                'X-Request-Id': `req_${Date.now()}`,
            },
            params: {
                job_id
            },
        });

        console.log("Manifestation Status Success:", response.data);
        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        if (error.response) {
            console.error("HTTP Error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        } else {
            console.error("Network or Other Error:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};



const updateLR = async (req, res) => {
    const { lrn, payload } = req.body;

    if (!lrn) {
        return res.status(400).json({ success: false, error: 'LRN is required' });
    }

    const formData = new FormData();
    const token = await getToken();
    if (!token || !token.data) {
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
    }


    if (payload.payment_mode) formData.append('payment_mode', payload.payment_mode);
    if (payload.cod_amount !== undefined) formData.append('cod_amount', payload.cod_amount);
    if (payload.consignee_name) formData.append('consignee_name', payload.consignee_name);
    if (payload.consignee_address) formData.append('consignee_address', payload.consignee_address);
    if (payload.consignee_pincode) formData.append('consignee_pincode', payload.consignee_pincode);
    if (payload.consignee_phone) formData.append('consignee_phone', payload.consignee_phone);
    if (payload.weight_g !== undefined) formData.append('weight_g', payload.weight_g);

    if (payload.dimensions) {
        payload.dimensions.forEach(dimension => {
            formData.append('dimensions[]', JSON.stringify(dimension));
        });
    }

    if (payload.callback) formData.append('callback', JSON.stringify(payload.callback));

    if (payload.invoices) {
        payload.invoices.forEach(invoice => {
            formData.append('invoices[]', JSON.stringify(invoice));
        });
    }

    if (payload.invoice_file) {
        payload.invoice_file.forEach(filePath => {
            formData.append('invoice_file[]', fs.createReadStream(filePath));
        });
    }

    if (payload.invoice_files_meta) {
        formData.append('invoice_files_meta', JSON.stringify(payload.invoice_files_meta));
    }

    const headers = {
        Authorization: `Bearer ${token.data}`,
        ...formData.getHeaders(),
    };

    try {

        const response = await axios.put(`https://api.delhivery.com/lrn/update/${lrn}`, formData, { headers });

        return res.json({ success: true, message: 'LR updated successfully', data: response.data });

    } catch (error) {
        console.error('Error updating LR:', error.response ? error.response.data : error.message);
        return res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
    }
};


const getLRStatus = async (req, res) => {
    const { job_id } = req.query; 
  
    if (!job_id) {
      return res.status(400).json({
        success: false,
        error: "Missing 'job_id' in query parameters.",
      });
    }
  
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = '/lrn/update/status';
    const url = `${baseURL}${endpoint}`;
  
    try {
      const token = await getToken();
      if (!token || !token.data) {
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token.data}`
        },
        params: {
          job_id
        },
      });
  
      console.log("LR Status Success:", response.data);
      return res.status(200).json({ success: true, data: response.data });
  
    } catch (error) {
      if (error.response) {
        console.error("HTTP Error:", error.response.status, error.response.data);
        return res.status(error.response.status).json({ success: false, error: error.response.data });
      } else {
        console.error("Network or Other Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  };
  

  
  const getLabelUrls = async (req, res) => {
    const { size, lrn } = req.params;
  
    if (!size || !lrn) {
      return res.status(400).json({
        success: false,
        error: "Missing 'size' or 'lrn' in path parameters.",
      });
    }
  
    const baseURL = 'https://ltl-clients-api-dev.delhivery.com';
    const endpoint = `/label/get_urls/${size}/${lrn}`;
    const url = `${baseURL}${endpoint}`;
  
    try {
      const token = await getToken();
      if (!token || !token.data) {
        return res.status(500).json({ success: false, error: "Authorization token missing or invalid." });
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token.data}`,
        },
      });
  
      console.log("Label URLs Success:", response.data);
      return res.status(200).json({ success: true, data: response.data });
  
    } catch (error) {
      if (error.response) {
        console.error("HTTP Error:", error.response.status, error.response.data);
        return res.status(error.response.status).json({ success: false, error: error.response.data });
      } else {
        console.error("Network or Other Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  };
  

  

module.exports = { getTatEstimate, getPincodeService, createClientWarehouse, createPickupRequest, deletePickupRequest, createManifest, getManifestStatus, updateLR, getLRStatus,getLabelUrls};



