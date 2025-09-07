import jwt from 'jsonwebtoken'
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no token provided or token expired."
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token."
            });
        }

        req.user = decoded;
    } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Errror. No token provided or token expired."
        });
    }
}

export default protectRoute