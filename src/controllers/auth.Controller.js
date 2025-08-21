import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import transporter from "../../mailtrap/mailtrap.config.js";
import { sendVerificationEmail } from "../../mailtrap/emails.js";

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); 
        const verificationTokenExpiresAt = new Date(Date.now() + 60* 60 * 1000); 

        const user = new User({ 
            name, 
            email,
            password: hashedPassword, 
            verificationToken,
            verificationTokenExpiresAt 
        });

        
        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({success: true, message: "User created successfully" });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({success: false, message: "Internal server error" });   
    }
}

export const Login = async () => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({success: false, message: "Email and password are required" });
    }
    try {
        const user = await User.find({ email });
        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({success: false, message: "Invalid password" });
        }
        user.lastLogin = Date.now();
        await user.save();
        generateTokenAndSetCookie(res, user._id);
        res.status(200).json({success: true, message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }

}

export const Logout = async () => {

}

export const ForgotPassword = async () => {

}

export const ResetPassword = async () => {

}

export const VerifyEmail = async () => {

}