const crypto = require('crypto');
const axios = require('axios');

async function phonePe(req, res) {
    try {
        const merchantTransactionId = 'M' + Date.now();
        
        const data = {
            merchantId: process.env.PHONE_PE_MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID' + `${Date.now()}`,
            name: "Kuldeep", // User Name
            amount: 1 * 100, // Amount in paise
            redirectUrl: `http://localhost:3000/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: 7828153133,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + process.env.PHONE_PE_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };
        axios.request(options).then(function (response) {
            // console.log("Response : ",response)
            return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
                console.error(error);
                res.status(500).send({
                    message: error.message,
                    success: false
                })
            });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

module.exports = {
    phonePe
}