import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        index : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    forgetPasswordToken : {
        type : String
    },
    forgetPasswordTokenExpiry : {
        type : Date
    },
    verifiedToken : {
        type : String
    },
    verifiedTokenExpiry : {
        type : Date
    }

},{timestamps : true})


userSchema.pre("save" , async function (next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password , 10)
    return next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SCERET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generaterefreshToken = async function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}





export const User = mongoose.model("User",userSchema)