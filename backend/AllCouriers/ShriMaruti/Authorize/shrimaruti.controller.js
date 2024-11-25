const axios = require('axios');

// Configuration (replace with actual values)
const BASE_URL = 'https://qaapis.delcaper.com'; // Replace with the actual base URL



const getToken = async () => {
    const email=process.env.SHREEMA_GMAIL;
    const password=process.env.SHREEMA_PASS;
    const vendorType="SELLER"

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
    } 

    try {
        const options = {
            method: "POST",
            url: "https://qaapis.delcaper.com/auth/login",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: { email, password, vendorType },
        };

        const response = await axios.request(options);
        
         
        if(response.status){
            return response.data.data.accessToken
        }
            else {
                throw new Error(`Login failed: ${response.status}`);
            }
       
    } catch (error) {
        throw new Error(`Error in authentication: ${error.message}`);
    }
};

module.exports =  getToken ;

