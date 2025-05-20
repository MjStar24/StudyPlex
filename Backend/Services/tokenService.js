import jwt from "jsonwebtoken";
import Token from "../Models/refreshToken.js";
const accessTokenSecret=process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret=process.env.JWT_REFRESH_TOKEN_SECRET;
import mongoose from "mongoose";

class tokenService{

    generateToken(payload){
        const accessToken=jwt.sign(payload,accessTokenSecret,{
            expiresIn:'1d',
        });

        const refreshToken=jwt.sign(payload,refreshTokenSecret,{
            expiresIn:'30d'
        })

        return {accessToken,refreshToken};
    }

    async storeRefreshToken(token,userId){
        try{
            await Token.create({
                token,
                userId,
            })
        }catch(e){
            console.log("Error in storing refresh token:", e);
        }
    }

    async findRefreshToken(userId,token){
        try{
            const storedToken= await Token.findOne({
                userId:new mongoose.Types.ObjectId(userId),
                token,
            })
            return storedToken
        }catch(e){
            console.log("Error in finding refresh token:", e);
        }
    }

    async updateRefreshToken(token,userId){
        try{
            return await Token.updateOne(
                {userId},
                {$set:{token}},
                {upsert:true},           
            
            )
        }catch(e){
            console.log("Error in updating refresh token:", e);
        }
    }

    async removeToken(token){
        try{
            return await Token.deleteOne({token})
        }catch(e){
            console.log("Error in removing token:", e);
        }
    }

    async verifyAccessToken(token){
        try {
            return jwt.verify(token, accessTokenSecret);
        } catch (e) {
            console.log("Error in verifying access token:", e);
        }
    }

    async verifyRefreshToken(token){
        try {
            return jwt.verify(token, refreshTokenSecret);
        } catch (e) {
            console.log("Error in verifying refresh token:", e);
        }
    }
}

export default new tokenService();