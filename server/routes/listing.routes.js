import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { createListing , getListingDetails, getListings, getListingsBySearch} from "../controllers/listing.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/create").post(
    upload.array('listingPhotos'),
    createListing
) 


router.route("/").get(
    getListings
) 

router.route("/:listingId").get(
    getListingDetails
) 

router.route("/search/:search").get(
    getListingsBySearch
) 


export default router