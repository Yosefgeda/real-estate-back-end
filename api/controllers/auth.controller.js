import User from "../models/users.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
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
        res.status(500).json(error.message);
    } 
}