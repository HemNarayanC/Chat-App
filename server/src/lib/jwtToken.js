import jwt from 'jsonwebtoken'

const generateToken = ({userId, email}, res) => {
    const accessToken = jwt.sign({userId, email}, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });

    res.cookie('token', accessToken, {
        httpOnly:  true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'strict',
        maxAge: 24*60*60*1000
    });

    return accessToken;
}


export {
    generateToken,
};