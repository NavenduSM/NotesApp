import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../../mailtrap/emails.js";

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

export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({success: false, message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({success: true, message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }

}

export const Logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({success: true, message: "Logout successful" });

}

export const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    if(!email) return res.status(400).json({success: false, message: "Email is required" });
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        }
        const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();  

        await sendResetPasswordEmail(user.email, resetPasswordToken);

        res.status(200).json({success: true, message: "Reset password token sent to email" });
    }
    catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}

export const ResetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
        return res.status(400).json({success: false, message: "Email, reset token and new password are required" });
    }
    try {
        const user = await User.findOne({ email, resetPasswordToken: resetToken, resetPasswordExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).json({success: false, message: "User not found or token expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetPasswordSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }

}

export const VerifyEmail = async (req, res) => {
    const { email, verificationToken } = req.body;
    if (!email || !verificationToken) {
        return res.status(400).json({success: false, message: "Email and verification token are required" });
    }
    try {
        const user = await User.findOne({verificationToken, verificationTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).json({success: false, message: "User not found" });
        }
        if (user.verificationToken !== verificationToken || user.verificationTokenExpiresAt < Date.now()) {
            return res.status(400).json({success: false, message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        sendWelcomeEmail(user.email, user.name); 

        res.status(200).json({success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}