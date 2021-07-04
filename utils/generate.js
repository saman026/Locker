const sha256 = require("sha256");

exports.unixTime = () => {
    return Math.floor((new Date()).getTime() / 1000);
}
    
exports.HMAC = (...data) => {
    return sha256(data[0]);
}
