function validateForm(data) {
    const errors = {};

    // Email validation (required, valid email format)
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(data.email)) {
    //     errors.email = "Invalid email format.";
    // }

    if(!validateEmail(data.email)){
        errors.email = "Invalid email format.";
    }

    // Phone number validation (required, valid phone format)
    const phoneRegex = /^[0-9]{10}$/;  // Assuming a 10-digit phone number
    if (!phoneRegex.test(data.phoneNumber)) {
        errors.phoneNumber = "Invalid phone number format.";
    }

    // Company name validation (optional)
    if (data.company && data.company.length < 2) {
        errors.company = "Company name must be at least 2 characters.";
    }

    // Monthly orders validation (optional, must be a positive integer)
    if (data.monthlyOrders && (!Number.isInteger(data.monthlyOrders) || data.monthlyOrders <= 0)) {
        errors.monthlyOrders = "Monthly orders must be a positive integer.";
    }

    // Password validation (required, minimum 8 characters)
    if (data.password && data.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    // Confirmed password validation (must match password)
    if ((data.confirmedPassword !== data.dapassword)) {
        errors.confirmedPassword = "Passwords do not match.";
    }

    if(!data.checked){
        errors.checked = "Please agree to the terms and conditions";
    }

    return errors;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 

module.exports = {
    validateForm,
    validateEmail
};