import { User } from "../models/user.model.js"
import { Listing } from "../models/listing.model.js"
import multer from "multer"
import { upload } from "../middlewares/multer.middleware.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import { Booking } from "../models/booking.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body

        const profileImage = req?.file

        if (!profileImage) {
            return res.status(400).send("No file uploaded!!")
        }

        // path to the uploaded profile photo 

        const profileImagePath = profileImage?.path
        
        const profile = await uploadOnCloudinary(profileImagePath)

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ message: "User already exists!!" })
        }
  
        // hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        

        /* Create a new User */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath:profile.url,
        });

        /* Save the new User */
        await newUser.save();

        const createdUser = await User.findById(newUser._id).select(
            "-password -refreshToken"
        );

        /* Send a successful message */
        res
            .status(200)
            .json({ message: "User registered successfully!", user: createdUser });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Registration failed!", error: error.message });
    }
}


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //we have to store refresh token inside database

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Something went wrong while generating refresh and access token!", error: error.message });
    }
}



const loginUser = async (req, res) => {
    //req->body ->data
    //verify the data
    //find the user
    //access and refresh token
    //send response

    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email
        })

        if (!user) {
            return res.status(409).json({ message: "User does not exists!" })
        }
        
        if(!user.active){
            res.status(400).json({message:"This acccount is not active, Try to contact the admin"});
        }
        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password!" })
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        //so that cookies are only modifiable by the server
        const options = {
            httpOnly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                { accessToken, refreshToken, loggedInUser }
            )
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

const getTripList = async (req, res) => {
    try {
        const { userId } = req.params
        const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
        res.status(200).json(trips)
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Cannot find trips!!", error: error.message })
    }
}


const addToWishList = async (req, res) => {
    try {
        const { userId, listingId } = req.params
        const user = await User.findById(userId)

        const listing = await Listing.findById(listingId).populate("creator")
   
        const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

            if (favoriteListing) {
                user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
                await user.save()
                res.status(200).json({ message: "Listing is removed from the wish list", wishList: user.wishList })
            } else {
                user.wishList.push(listing)
                await user.save()
                res.status(200).json({ message: "Listing is added to the wish list", wishList: user.wishList })
            }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error.message })
    }
}

const getPropertyList = async (req, res) => {
    try {
        const { userId } = req.params
        const properties = await Listing.find({ creator: userId }).populate("creator")
        res.status(200).json(properties)
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Cannot find properties!!", error: error.message })
    }
}

const getReservationList = async (req, res) => {
    try {
        const { userId } = req.params
        const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
        res.status(200).json(reservations)
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Cannot find reservation!!", error: error.message })
    }
}

const getUsers = async(req,res) =>{
    const users = await User.find().sort({_id: -1});
    res.status(200).json({success:true, result:users})
}

const updateStatus = async(req,res) =>{
    try {
        const {role,active} = req.body
        const {userId} = req.params
        await User.findByIdAndUpdate(userId ,{role,active})
        res.status(200).json({success:true , result:{_id:userId}})
    } catch (error) {
        console.log("Failed in updating the status",error);
    }
}


// const logoutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $set: {
//                 refreshToken: undefined
//             }
//         },
//         {
//             new: true
//         }
//     )

//     const options = {
//         httpOnly: true,
//         secure: true,
//     }
//     return res.status(200)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(new ApiResponse(200, {}, "User logged out"))


// })


// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "Unauthorized request");
//     }

//     try {
//         const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

//         const user = await User.findById(decodedToken?._id)

//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token")
//         }

//         if (incomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used")
//         }

//         const options = {
//             httpOnly: true,
//             secure: true,
//         }

//         const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

//         return res.status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", newRefreshToken, options)
//             .json(new ApiResponse(200,
//                 {
//                     accessToken,
//                     refreshToken: newRefreshToken
//                 }
//                 , "Access token refreshed"))
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token")
//     }
// })



// const changeCurrentPassword = asyncHandler(async (req, res) => {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user?._id)
//     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

//     if (!isPasswordCorrect) {
//         throw new ApiError(400, "Invalid old password")
//     }

//     user.password = newPassword
//     await user.save({ validateBeforeSave: false })

//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Password changed successfully"))
// })

// const getCurrentUser = asyncHandler(async (req, res) => {
//     return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"))
// })

// const updateAccountDetails = asyncHandler(async (req, res) => {

//     const { fullName, email } = req.body

//     if (!fullName || !email) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const user = await User.findByIdAndUpdate(req.user?._id, {
//         $set: {
//             fullName,
//             email: email
//         }
//     }, { new: true }).select("-password")

//     return res.status(200)
//         .json(new ApiResponse(200, user, "Account details updated successfully"))

// })



export { registerUser, loginUser, getTripList, addToWishList, getPropertyList , getReservationList , getUsers , updateStatus}