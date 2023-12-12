import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.route.js';

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

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Server started'))