import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import transporter from "./mailtrap.config.js";
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
      category: "Email Verification",
    });

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};


export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Notes App",
      html: `<h1>Welcome, ${name}!</h1><p>Thanks for joining ShopSphere. We're glad to have you!</p>`,
      category: "Welcome Email",
    });
    console.log("Welcome email sent:", info.messageId);
    } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Error sending welcome email");
  }
};


export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", `${process.env.APP_URL}/reset-password?token=${resetToken}`),
            category: "Password Reset",
        });
        console.log("Reset password email sent:", info.messageId);
    }
    catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Error sending reset password email");
    }   
}


export const sendResetPasswordSuccessEmail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Reset password success email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending reset password success email:", error);
        throw new Error("Error sending reset password success email");
    }
}