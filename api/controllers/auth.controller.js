import User from "../models/users.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandlers } from "../utils/error.js";

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
        const validUser = await User.findOne({ email }).exec();
        console.log(validUser)
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
        next(error)
    }
}