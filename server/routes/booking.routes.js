import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { createBooking } from "../controllers/booking.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/create").post(
    createBooking
) 


export default router