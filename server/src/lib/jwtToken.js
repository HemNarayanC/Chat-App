import jwt from 'jsonwebtoken'

const generateToken = ({ userId, email }, res) => {
    const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });

    const isProd = process.env.NODE_ENV === 'production';

    console.log("Mode ", process.env.NODE_ENV)
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });

    return accessToken;
}


export {
    generateToken,
};