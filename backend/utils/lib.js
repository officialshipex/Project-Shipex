const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();


function getSignature(){
    // console.log("Generating signature");
    let clientId = process.env.X_CLIENT_ID;
    let publicKey = process.env.PUBLIC_KEY;
    let timestamp = Math.floor(Date.now() / 1000);
    let dataToEncrypt = `${clientId}.${timestamp}`;
    let encryptedSignature = crypto.publicEncrypt(publicKey, Buffer.from(dataToEncrypt));
    let signatureBase64 = encryptedSignature.toString('base64');
    // console.log(`X-Cf-Signature: ${signatureBase64}`);
    return signatureBase64;
}

function validateGST(gstNumber) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

module.exports = {
    getSignature,
    validateGST,
};