import User from "../models/users.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandlers } from "../utils/error.js";
import hashSync from "bcryptjs";

export const signup = async (req, res, next) => {
    const hashedPassword = bcryptjs.hashSync(req.body.password, 10)
    
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    
    try {
        await user.save()
        res.status(201).json({
            message: 'User Created successfuly'
        })
    } catch(error){
        next(error)
        // res.status(500).json(error.message);
    } 
}

export const signin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    try {
        const validUser = await User.findOne({ email });
        if(!validUser) return errorHandlers(401, 'Invalid Credentials')
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) return errorHandlers(401, 'Invalid Credentials');
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc; // removing password from 
        const expireDate = new Date(Date.now() + 3600000) // 1 hour
        res
            .cookie('access_token', token, { httpOnly: true, expires: expireDate } )
            .status(200)
            .json(rest)
    } catch(error) {
        // res.json(error)
        next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc; // removing password from 
            const expireDate = new Date(Date.now() + 3600000) // 1 hour
            res
            .cookie('access_token', token, { httpOnly: true, expires: expireDate })
            .status(200)
            .json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).split(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 10000).toString(),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc; // removing password from 
            const expireDate = new Date(Date.now() + 3600000) // 1 hour
            res
            .cookie('access_token', token, { httpOnly: true, expires: expireDate })
            .status(200)
            .json(rest);
        }
    } catch(error) {
        next(error)            
    }
}

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json("Signout successful");
}