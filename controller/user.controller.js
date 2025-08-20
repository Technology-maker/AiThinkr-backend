import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check all required fields
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                error: "All fields (firstname, lastname, email, password) are required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "User signup successfully" });
    } catch (error) {
        console.error("❌ Error in signup:", error);

        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: "Invalid email or password Please check again !" });
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid email or password Please check again !" });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            config.JWT_USER_PASSWORD,
            { expiresIn: "5d" }
        );

        // cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        res.cookie("jwt", token, cookieOptions);

        // remove password before sending response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            message: "User logged in successfully",
            user: userWithoutPassword,
            token,
        });

    } catch (error) {
        console.error("❌ Error in login:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};


export const logout = (req, res) => {
    try {
        res.clearCookie("jWT", {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict"
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout !", error);
        return res.status(500).json({ error: "Error in Logout !" });
    }

}

