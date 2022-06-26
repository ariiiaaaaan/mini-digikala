import Axios, { AxiosRequestConfig } from 'axios'
import utility from './OtpUtils'

const getToken = async () => {
    const options: AxiosRequestConfig = {
        'method': 'POST',
        'url': 'https://RestfulSms.com/api/Token',
        'headers': {
        'Content-Type': 'application/json'
        },
        'data': {
            'UserApiKey':process.env.SMS_API_KEY,
            'SecretKey': process.env.SMS_API_SECRET
        }
    }
    try {
        return (await Axios(options)).data.TokenKey
    } catch (error) {
        console.log(error)
    }
}

const sendVerificatonCode = async (mobileNumber) => {
    const options: AxiosRequestConfig = {
        'method': 'POST',
        'url': 'https://RestfulSms.com/api/VerificationCode',
        'headers': {
            'Content-Type': 'application/json',
            'x-sms-ir-secure-token': await getToken()
        },
        'data': {
            'Code':utility.generateOTP(6),
            'MobileNumber': mobileNumber
        }
    }
    try {
        await Axios(options)
        return options.data.Code
    } catch (error) {
        console.log(error)
    }
}

export default { sendVerificatonCode }