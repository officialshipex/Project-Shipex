const axios = require('axios');

const getToken = async (req, res) => {
    const refresh_token = process.env.REFRESH_TOKEN; // Read refresh token from environment variables

    if (!refresh_token) {
        return res.status(400).json({
            message: "Refresh Token is required.",
        });
    }

    try {
        // Prepare API request
        const options = {
            method: 'post',
            url: 'https://api-cargo.shiprocket.in/api/token/refresh/',
            headers: {
                'Authorization': `Bearer ${refresh_token}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ refresh: refresh_token }), // Ensure proper JSON format
        };

        const response = await axios.request(options);        

        const newToken = response.data.access_token || response.data.access; // Adjust based on actual API response
        
        return response.data.access

    } catch (error) {
        return ("Error in token refresh:", error.message);
    }
};

module.exports ={
    getToken
}