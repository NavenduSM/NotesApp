import express from 'express';
import { ForgotPassword, Login, Logout, ResetPassword, Signup, VerifyEmail } from '../controllers/auth.Controller.js';
import { checkAuth } from '../controllers/auth.Controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';


const routers = express.Router();

routers.post('/signup', Signup);

routers.post('/verify-email', VerifyEmail);

routers.post('/login', Login);

routers.post('/logout', Logout);

routers.post('/forgot-password', ForgotPassword);

routers.post('/reset-password/:resetToken', ResetPassword);

routers.get('/check-auth', verifyToken, checkAuth);



export default routers