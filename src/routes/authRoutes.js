import express from 'express';
import { ForgotPassword, Login, Logout, ResetPassword, Signup, VerifyEmail } from '../controllers/auth.Controller.js';


const routers = express.Router();

routers.post('/signup', Signup);

routers.post('/verify-email', VerifyEmail);

routers.post('/login', Login);

routers.post('/logout', Logout);

routers.post('/forgot-password', ForgotPassword);

routers.post('/reset-password', ResetPassword);

routers





export default routers