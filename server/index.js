/* eslint-disable import/extensions */
import {} from 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';

const app = express();

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
