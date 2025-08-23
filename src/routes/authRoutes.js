import express from 'express';
import { ForgotPassword, Login, Logout, ResetPassword, Signup, VerifyEmail } from '../controllers/auth.Controller.js';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notes.controller.js';
import { checkAuth } from '../middlewares/checkAuth.js';


const routers = express.Router();

routers.post('/signup', Signup);

routers.post('/verify-email', VerifyEmail);

routers.post('/login', Login);

routers.post('/logout', Logout);

routers.post('/forgot-password', ForgotPassword);

routers.post('/reset-password/:resetToken', ResetPassword);



export default routers