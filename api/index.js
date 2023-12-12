import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import userRoutes from './routes/user.routes.js';

dotenv.config()

const app = express();

const url = process.env.MONGO
mongoose.connect(url).then(() => {
    console.log('Connected To Mongodb')
}).catch((err) => {
    console.log(err)
});

app.use('/api/users', userRoutes)

app.listen(3000, () => console.log('Server started'))