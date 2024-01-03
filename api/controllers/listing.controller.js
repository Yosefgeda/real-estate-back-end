import Listing from "../models/listing.model.js";
import { errorHandlers } from "../utils/error.js";


export const createListing = async(req, res, next) => {
    try {
        const listingData = await Listing.create(req.body);
        return res.status(200).json(listingData)
    } catch(err) {
        next(err)
    }
}

export const deleteUserListing = async (req, res, next) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch(err) {
        next(errorHandlers(401, "Encountered some error."))
    }
}

export const updateListing = async (req, res, next) => {
    const listing  = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandlers(401, "No listing found with this id"));
    if(req.user.id !== listing.userRef) {
        return next(errorHandlers(401, "You can only edit your listing!"));
    }
    try {
      const updatedListing = await Listing.findByIdAndUpdate(req.params.id, 
            req.body
        , {new: true} // to update the user database;
        );
        res.status(200).json(updatedListing);
    } catch(err) {

    }
}