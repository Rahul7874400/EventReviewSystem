import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendEmail } from "../utils/mailer.js"
import { RESET, VERIFY } from "../constants.js"


const generateAccessTokenAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(404 , "Invalid User")
        }

        //console.log("user : ",user)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave : false
        })

        

        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(404 , error.message||"something went worng while genetrating token")
    }
}



// user registration
const registerUser = asyncHandler( async(req,res)=>{
    // get user data
    const {email,userName,password,fullName} = req.body

    // validation
    if(!email || email.length == 0){
        throw new ApiError(404 , "email is required")
    }else if(!userName || userName.length == 0){
        throw new ApiError(404 , "user name is required")
    }else if(!password || password.length == 0){
        throw new ApiError(404 , "password is required")
    }else if(!fullName || fullName.length == 0){
        throw new ApiError(404 , "full name is required")
    }

    // check for already exist or not

    const existedUser = await User.findOne({
        $or : [{email} , {userName}]
    })

    if(existedUser){
        throw new ApiError(404 , "user already existed")
    }

    //create object in database and store
    const user = await User.create({
        userName,
        fullName,
        email,
        password
    })

    await user.save()

   

    

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(404 , "Something went worng while registering the user")
    }


     // send email
    sendEmail({email , emailType : VERIFY , userId : createdUser._id})

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User Registered successfully"
        )
    )


} )

const loginUser = asyncHandler(async (req,res)=>{
    //get data
    const {email , userName , password} = req.body

    // validation 
    if(!email && !userName){
        throw new ApiError(404 , "email or user name is required")
    }

    // check user is existed or not
    const user = await User.findOne({
        $or : [{email} , {userName}]
    })

    if(!user){
        throw new ApiError(404 , "user does not exist")
    }

    const {accessToken , refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    // console.log("Access Token :",accessToken)
    // console.log("refreshToken : ",refreshToken )


    const loggedinUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            201,
            loggedinUser,
            "User loggedin successfully"
        )
    )
})

const logoutUser = asyncHandler( async(req,res)=>{
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset : {
                refreshToken : true
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            201,
            {},
            "User logg out successfully"
        )
    )
} )

const verifyEmail = asyncHandler(async(req,res)=>{

    const {token} = req.params
    
    const user = await User.findOne(
        {
            verifiedToken : token,
            verifiedTokenExpiry : {
                $gt : Date.now()
            }
        }
    )

    if(!user){
        throw new ApiError(404 , "Invalid token")
    }

    user.isVerified = true,
    user.verifiedToken = undefined
    user.verifiedTokenExpiry = undefined

    await user.save({validateBeforeSave : false})

    const existedUser = User.findById(user._id).select("-password")


    return res
    .status(202)
    .json(
        new ApiResponse(
            200,
            existedUser,
            "User verified uccessfully"
        )

    )


})

const forgotPassword = asyncHandler( async(req,res)=>{
    let {email , userName}  = req.body

    if(!email && !userName){
        throw new ApiError(404 , "Email or Username is required")
    }

    const user = await User.findOne({
        $or : [{email} , {userName}]
    })

    if(!user){
        throw new ApiError(404 , "User does not exist")
    }

    email = user.email
    // send email

    sendEmail({email , emailType : RESET , userId : user._id})

    const response = await User.findById(user._id).select("-password")

    return res
    .status(202)
    .json(
        new ApiResponse(
            201,
            response,
            "Email send succesfully"
        )
    )

} )


const updatePassword = asyncHandler( async(req,res)=>{
    const {token} = req.params
    const {password} = req.body

    const user = User.findOne({
        forgetPasswordToken : token,
        forgetPasswordTokenExpiry : {
            $gt : DataTransfer.now()
        }
    })

    if(!user){
        throw new ApiError(404 , "Invalide Token")
    }

    user.password = password
    user.forgetPasswordToken = undefined,
    user.forgetPasswordTokenExpiry = undefined,
    await user.save()


    const response = user.select("-password")

    return res
    .status(202)
    .json(
        new ApiResponse(
            201,
            response,
            "Password update successfully"
        )
    )

    
} )



export {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgotPassword,
    updatePassword
}