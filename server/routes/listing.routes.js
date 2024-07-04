import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { createListing , deleteListing, getListingDetails, getListings, getListingsBySearch} from "../controllers/listing.controller.js"

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

router.route("/delete/:listingId").delete(
    deleteListing
) 

export default router