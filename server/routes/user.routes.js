import { Router } from "express"
import { registerUser ,loginUser, getTripList, addToWishList, getPropertyList, getReservationList, getUsers, updateStatus } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.single('profileImage'),
    registerUser
) 


router.route("/login").post(loginUser)
router.route("/").get(getUsers)
router.route("/updateStatus/:userId").patch(updateStatus)
router.route("/:userId/trips").get(getTripList)
router.route("/:userId/:listingId").patch(addToWishList)
router.route("/:userId/properties").get(getPropertyList)
router.route("/:userId/reservations").get(getReservationList)

// //secured routes

// router.route("/logout").post(verifyJwt, logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJwt, changeCurrentPassword)
// router.route("/current-user").get(verifyJwt, getCurrentUser)
// router.route("/update-account").patch(verifyJwt, updateAccountDetails)
// router.route("/cover-image").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)
// router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
// router.route("/c/:username").get(verifyJwt, getUserChannelProfile)
// router.route("/history").get(verifyJwt, getWatchHistory)

export default router