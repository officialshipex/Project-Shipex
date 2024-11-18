const axios = require('axios');
const FormData = require('form-data');

const checkServiceability = async () => {
    const url = 'https://clbeta.ecomexpress.in/services/expp/expppincode/';

    // Create form data
    const formData = new FormData();
    formData.append('username','SHIPEXINDIA914919'); 
    formData.append('password','75DDO5nqRy'); 
    formData.append('origin_pincode', '110037');
    formData.append('destination_pincode', '691334');

    try {
        // Send POST request
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders(), // Use headers from FormData
        });

        console.log('Response:', response.data); // Log the response data
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data); // Log server errors
        } else {
            console.error('Error:', error.message); // Log connection or other errors
        }
    }
};

// Call the function
checkServiceability();
