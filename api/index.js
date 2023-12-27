import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';
import listingRoutes from './routes/listing.route.js';

import cookieParser from 'cookie-parser';

dotenv.config()

mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const url = process.env.MONGO
mongoose.connect(url).then(() => {
    console.log('Connected To Mongodb')
}).catch((err) => {
    console.log(err)
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes);

app.use(cookieParser());

app.listen(3000, () => console.log('Server started'))

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Enternal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
