// Generate random number with given length
const generateOTP = (otpLength) => {
    const digits = "0123456789"
    let OTP = ""
    for (let i = 0; i < otpLength; i++) {
        OTP += digits[Math.floor(Math.random() * 10)]   
    }
    return OTP
}

export default { generateOTP }