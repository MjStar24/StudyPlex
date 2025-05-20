import { generateToken04 } from "../Services/zegoTokenGenerator.js";

const appId=parseInt(process.env.ZEGO_APP_ID,10);
const secret=process.env.ZEGO_APP_SECRET;

class LiveStreamController{
    async generateToken(req,res){
        try{
            const userId=req.user._id;
            const effectiveTime=60*60;
            const token=generateToken04(appId,userId,secret,effectiveTime);
            console.log(token);
            return res.status(200).json({token});
        }catch(e){
            console.log(e);
            return res.status(500).json({message:'Error while create zeego token'});
        }
    }
}

export default new LiveStreamController();