import hashService from "./hashService.js";
import twilio from "twilio";
import crypto from 'crypto';

const smsSid=process.env.SMS_SID;
const smsAuthToken=process.env.SMS_AUTH_TOKEN;

const tw=twilio(smsSid,smsAuthToken,{
    lazyLoading:true,
})

class OtpService{
    async generateOtp(){
        const otp=crypto.randomInt(1000,9999).toString();
        console.log(otp);
        return otp;
    }

    async sendBySms(phone,otp){
        return await tw.messages.create({
            to:phone,
            from:process.env.SMS_FROM_NUMBER,
            body:`Your StudyPlex OTP is ${otp}`
        });
    }

    async verifyOtp(hashedOtp,data){
        let computedHash= await hashService.hashOtp(data);
        console.log(computedHash);
        console.log(hashedOtp);
        return computedHash===hashedOtp;
    }

}

export default new OtpService();



