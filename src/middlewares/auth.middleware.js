import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


export const verifyJwt = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        console.log("token" , token)

        if(!token){
            throw new ApiError(404 , "unauthorized user")
        }

        const decode =  jwt.verify(token , process.env.ACCESS_TOKEN_SCERET)
        const user = await User.findById(decode._id).select("-password")

        if(!user){
            throw new ApiError(404 , "Invalide Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(404 , error.message || "Invalid user")
    }
})