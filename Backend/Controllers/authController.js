import User from "../Models/userModel";
import hashService from "../Services/hashService";
import otpService from "../Services/otpService";
import tokenService from "../Services/tokenService";

class AuthController{
    async sendOtp(req,res){
        const {phone}=req.body;
        if(!phone) return res.status(400).json({message:'Phone field is required!'});

        const otp=await otpService.generateOtp();

        const ttl=1000*60*2; // 2min
        const expires=Date.now()+ttl;
        const data=`${phone}.${otp}.${expires}`;
        const hash=hashService.hashOtp(data);

        try{
            
            // await otpService.sendBySms(phone,otp);

            return res.status(200).json({hash:`${hash}.${expires}`,phone});

        }catch(e){
            console.log(e);
            return res.status(500).json({message:'message sending failed'});
        }
    }

    async verifyOtp(req,res){
        const{otp,hash,phone}=req.body;
        if(!otp || !hash || !phone) return res.status(400).json({message:'All fields are required'});

        const[hashedOtp,expires]=hash.split('.');

        if(Date.now()>+expires) return res.status(400).json({message:'OTP expired!'});

        const data=`${phone}.${otp}.${expires}`;
        const isValid=otpService.verifyOtp(hashedOtp,data);

        if(!isValid) return res.status(400).json({message:'Invalid OTP'});

        let user;
        try{
            user=await User.findOne({phone});
            if(!user) user=await User.create({phone});
        }catch(e){
            console.log(e);
            return res.status(500).json({message:'Db error'});
        }

        const {accessToken,refreshToken}=tokenService.generateToken({
            _id:user._id,
            activated:false,
        });

        return res.status(200).json({accessToken,refreshToken});
    }

    async refresh(req,res){
        try{
            const {refreshTokenFromClient}=req.body;

            let userData;
            userData=await tokenService.verifyRefreshToken(refreshTokenFromClient);

            if(!userData) return res.status(401).json({message:'Invalid Token'});

            const token=await tokenService.findRefreshToken(userData._id,refreshTokenFromClient);

            if(!token) return res.status(401).json({message:'Invalid Token'});

            const user=await User.findOne({_id:userData._id});

            if(!user) return res.status(404).json({message:"No User Found"});

            const {accessToken,refreshToken}=tokenService.generateToken({_id:userData._id});

            await tokenService.updateRefreshToken(refreshToken,userData._id);

            return res.status(200).json({
                accessToken,
                refreshToken
            });
        }catch(e){
            console.log(e);
            return res.status(500).json({message:'Internal Server Error'});
        }
        
    }

}

export default new AuthController();