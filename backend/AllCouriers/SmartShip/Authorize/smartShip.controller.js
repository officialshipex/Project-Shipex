const axios = require('axios');

const getAccessToken = async () => {
    const credentials = {
        username: process.env.SMARTSHIP_USERNAME,
        password: process.env.SMARTSHIP_PASSWORD,
        client_id: process.env.SMARTSHIP_CLIENT_ID,
        client_secret: process.env.SMARTSHIP_CLIENT_SECRET,
        grant_type: "password",
    };

    try {
        const response = await axios.post('https://oauth.smartship.in/loginToken.php', credentials, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Access Token:', response.data.access_token);
        return response.data.access_token   
        // return res.status(201).json({access:response.data.access_token});
    } catch (error) {
        console.log('Error fetching access token:', error.response);
        return error.response.data
        }
    }


module.exports = { getAccessToken };

