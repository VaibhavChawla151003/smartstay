import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJwt = async (req,_,next) =>{ 
   try {
    const token = req.cookies?.accessToken || req.headers.authorization.split(' ')[1];
 
    if(!token){
      console.log("token not found");
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        console.log("user not found");
    }
 
    req.user = user;
    next()
   } catch (error) {
    console.log("token invalid");
   }
}