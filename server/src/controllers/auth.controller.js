import User from "../models/user.model";
import bcrypt from 'bcrypt'

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
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
            name,
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

export {
    signup
}