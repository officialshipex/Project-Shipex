export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[1-9]\d{9}$/;  // Matches 10 digits, starting with 1-9
    return phoneRegex.test(phoneNumber);
}
