const otpGenerator = require('otp-generator');
module.exports.generateOTP = () => {
    const OTP_CONFIG = {
        upperCaseAlphabets: false,
        specialChars: false,
    };
    const OTP = otpGenerator.generate(process.env.OTP_LENGTH, OTP_CONFIG);
    return OTP;
};