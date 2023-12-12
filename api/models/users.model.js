import mongoose, { Schema } from "mongoose";


// const Schema = new Schema();

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;