import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/user.model"


export const verifyJwt = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken

    if(!token){
        throw new ApiError(404 , "unauthorized user")
    }

    const decode = jwt.verify(token , process.env.ACCESS_TOKEN_SCERET)

    const user = await User.findById(decode?._id).select("-password")

    if(!user){
        throw new ApiError(404 , "Invalid Token")
    }

    req.user = user

    next()
})