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