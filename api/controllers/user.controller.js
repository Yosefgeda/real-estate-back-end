import User from "../models/users.model.js";
import { errorHandlers } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'Working API...'
    })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandlers(401, "You can only update your account!"));
    }
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.params.username,
                    email: req.params.email,
                    password: req.params.password,
                    profilePicture: req.params.profilePicture,
                }
            }, {new: true} // to update the user database;
        );
        const { password, ...rest } = updateUser._doc; // to separate the password
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}