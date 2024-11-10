const crypto = require("crypto");

exports.generateChecksum = (params, key) => {
  const data = Object.keys(params)
    .sort()
    .map((key) => params[key])
    .join("|");

  return crypto.createHmac("sha256", key).update(data).digest("base64");
};

exports.verifyChecksum = (params, key, checksum) => {
  const generatedChecksum = this.generateChecksum(params, key);
  return generatedChecksum === checksum;
};