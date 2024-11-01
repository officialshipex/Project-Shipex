export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[1-9]\d{9}$/;  // Matches 10 digits, starting with 1-9
    return phoneRegex.test(phoneNumber);
}

export function validateGST(gstNumber) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
}


export function validatePAN(pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
}

export function validateAadhaar(aadhaar) {
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
    return aadhaarRegex.test(aadhaar);
}

export function validateAccountNumber(accountNumber) {
    const bankAccountRegex = /^[a-zA-Z0-9]{6,40}$/;
    return bankAccountRegex.test(accountNumber);
}

// IFSC validation: 11 characters, first 4 alphabets, 5th character 0, last 6 digits
export function validateIFSC(ifsc) {
    const ifscRegex = /^[A-Z]{4}0[0-9]{6}$/;
    return ifscRegex.test(ifsc);
}
// Name validation: alphanumeric, space, period, hyphen, slash, ampersand
export function validateName(name) {
    const nameRegex = /^[a-zA-Z0-9\s\.\-\/\&]+$/;
    return nameRegex.test(name);
}

// Phone validation: numeric, 8 to 13 digits
export function validatePhone(phone) {
    const phoneRegex = /^[0-9]{8,13}$/;
    return phoneRegex.test(phone);
}