import jwt from "jsonwebtoken";
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

    async verifyAccessToken(token){
        return jwt.verify(token,accessTokenSecret);
    }

    async verifyRefreshToken(token){
        return jwt.verify(token,refreshTokenSecret);
    }
}

export default new tokenService();