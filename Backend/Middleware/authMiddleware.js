import tokenService from "../Services/tokenService.js";

export const authMiddleware= async (req,res,next)=>{
    try{
        const authHeader=req.headers['authorization'];
        if(!authHeader) return res.status(400).json({message:"authorization header is missing"});
        const token=authHeader.split(' ')[1];// send like : "Bearer token"
        const userData=await tokenService.verifyAccessToken(token);
        req.user=userData;
        next();
    }catch(e){
        console.log(e);
        return res.status(500).json({message:"Error while authenticating"});
    }
}