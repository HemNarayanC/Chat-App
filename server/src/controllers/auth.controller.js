import { generateToken } from "../lib/jwtToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (newUser) {
            res.status(201).json({
                success: true,
                message: "registered successfully",
                newUser
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error. User not created.",
            newUser
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required to login"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken({ userId: user._id, email }, res);
        res.status(200).json({
            success: true,
            message: "logged in successfully",
            token
        });

    } catch (error) {
        console.log("Error in logged in", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error. User not logged in"
        });
    }
}

const logout = async (req, res) => {
    try {
        if (res.cookies?.token) {
            res.clearCookie("token");
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout",
        });
    }
}

export {
    signup,
    login,
    logout
}