import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './db/connectDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();

await connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}`);
})