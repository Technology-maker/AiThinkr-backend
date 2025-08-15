import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const signup = async (req, res) => {

    // take all data frrom frontend or body
    const { firstname, lastname, email, password } = req.body;
    console.log(firstname, lastname, email, password);
    try {
        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: "Email already exists" });
        }
        // hashing pasword  
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
        
        console.error("Error in signup:", error.message);
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
    const { email, password } = req.body;
    try {

        // check if user exists in our database
        const user = await User.findOne({ email });

        // if user not found is invalid
        if (!user) {
            return res.status(403).json({ errors: "Invalid email or password" });
        }

        // check if pasword is mach correctly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // if pasword not found 
        if (!isPasswordValid) {
            return res.status(403).json({ errors: "Invalid email or password" });
        }

        // token generate when user is valid 
        const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, { expiresIn: '5d' });

        const cookieOptions = {
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in milliseconds
            httpOnly: true, // optional: makes cookie accessible only by web server
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict' // optional: helps prevent CSRF attacks
        };
        res.cookie("jWT", token, cookieOptions);

        // if user found and password is valid
        return res.status(200).json({ message: "User logged in successfully", user, token });

        // some error  
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Internal Server Error", error.message);
        return;
    }
}

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

