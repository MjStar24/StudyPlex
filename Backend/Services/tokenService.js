import jwt from "jsonwebtoken";
import Token from "../Models/refreshToken.js";
const accessTokenSecret=process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret=process.env.JWT_REFRESH_TOKEN_SECRET;

class tokenService{
    generateToken(payload){
        const accessToken=jwt.sign(payload,accessTokenSecret,{
            expiresIn:'1m',
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
            console.log(e);
        }
    }

    async findRefreshToken(token,userId){
        try{
            return await Token.findOne({
                token,
                userId,
            })
        }catch(e){
            console.log(e);
        }
    }

    async updateRefreshToken(token,userId){
        try{
            return await Token.updateOne({
                token,
                userId,
            })
        }catch(e){
            console.log(e);
        }
    }

    async removeToken(token){
        try{
            return await Token.deleteOne({token})
        }catch(e){
            console.log(e);
        }
    }

    async verifyAccessToken(token){
        return jwt.verify(token,accessTokenSecret);
    }

    async verifyRefreshToken(token){
        return jwt.verify(token,refreshTokenSecret);
    }
}

export default new tokenService();