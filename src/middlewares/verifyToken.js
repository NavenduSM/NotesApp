import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

