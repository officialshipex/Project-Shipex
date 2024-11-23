const axios = require("axios");
const Order = require("../../../models/orderSchema.model");
const {getAuthToken}=require("../Authorize/XpressbeesAuthorize.controller");

const createShipment = async (req, res) => {
    const { shipmentData } = req.body;
    const url = 'https://shipment.xpressbees.com/api/shipments2';
    

    try {

        const token = await getAuthToken();
        const response = await axios.post(url, shipmentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            return res.status(201).json(response.data.data);
        } else {
            return res.status(400).json({ error: 'Error creating shipment', details: response.data });
        }
    } catch (error) {
        console.error('Error in creating shipment:', error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


const reverseBooking = async (req, res) => {
    const { shipmentData } = req.body;
    const url = 'https://shipment.xpressbees.com/api/reverseshipments';
    

    try {

        const token = await getAuthToken();
        const response = await axios.post(url, shipmentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            return res.status(201).json(response.data.data);
        } else {
            return res.status(400).json({ error: 'Error creating reverse booking', details: response.data });
        }
    } catch (error) {
        console.error('Error in creating reverse booking:', error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

const trackShipment = async (req, res) => {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
        return res.status(400).json({ error: 'Tracking number is required' });
    }

    const url = `https://shipment.xpressbees.com/api/shipments2/track/${trackingNumber}`;

    try {
        const token = await getAuthToken();
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in tracking shipment:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


const pickup = async (req, res) => {
    const { awbNumbers } = req.body;

    if (!awbNumbers || !Array.isArray(awbNumbers) || awbNumbers.length === 0) {
        return res.status(400).json({ error: 'AWB numbers must be a non-empty array' });
    }

    const url = 'https://shipment.xpressbees.com/api/shipments2/manifest';

    try {
        const token = await getAuthToken();
        const payload = { awbs: awbNumbers };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            return res.status(200).json(response.data.data);
        } else {
            return res.status(400).json({ error: 'Error in manifest creation', details: response.data });
        }
    } catch (error) {
        console.error('Error in creating manifest:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};




const cancelShipment = async (req, res) => {
    const { awb } = req.body;

    if (!awb) {
        return res.status(400).json({ error: 'AWB number is required' });
    }

    const url = 'https://shipment.xpressbees.com/api/shipments2/cancel';

    try {
        const token = await getAuthToken();
        const payload = { awb };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            return res.status(200).json(response.data.data);
        } else {
            return res.status(400).json({ error: 'Error in shipment cancellation', details: response.data });
        }
    } catch (error) {
        console.error('Error in cancelling shipment:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


const exceptionList = async (req, res) => {
    try {
      const token = await getAuthToken();
      const url = 'https://shipment.xpressbees.com/api/ndr';
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  };
  
const createNDR = async (req, res) => {
    const ndrActions = req.body;

    if (!Array.isArray(ndrActions) || ndrActions.length === 0) {
        return res.status(400).json({ error: 'Invalid input. NDR actions must be a non-empty array.' });
    }

    const url = 'https://shipment.xpressbees.com/api/ndr/create';

    try {
        const token = await getAuthToken();

        const response = await axios.post(url, ndrActions, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.some((item) => !item.status)) {
            console.warn(
                'Some actions failed:',
                response.data.filter((item) => !item.status)
            );
            return res.status(207).json({ // HTTP 207 for partial success
                message: 'Some actions failed',
                data: response.data,
            });
        }

        return res.status(200).json({ message: 'All actions performed successfully', data: response.data });
    } catch (error) {
        console.error('Error in performing NDR actions:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.response?.data?.message || error.message });
    }
};

module.exports={
  createShipment,
  reverseBooking,
  createNDR,
  exceptionList,
  cancelShipment,
  pickup,
  trackShipment
}