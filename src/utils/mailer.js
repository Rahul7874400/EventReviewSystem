import nodemailer from "nodemailer"
import { asyncHandler } from "./asyncHandler.js"
import { VERIFY , RESET } from "../constants.js";
import bcrypt from "bcrypt"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const sendEmail = async( {email,emailType,userId} )=>{
    try {
        var transport = nodemailer.createTransport({
            host : process.env.MAILER_HOST,
            port : process.env.MAILER_PORT,
            auth : {
                user : process.env.MAILER_AUTH_USER,
                pass : process.env.MAILER_AUTH_PASSWORD
            }
        });
        const hashedToken = await bcrypt.hash(userId.toString() , 10)
    
        if(emailType === VERIFY){
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    verifiedToken : hashedToken,
                    verifiedTokenExpiry : Date.now() + 3600000
                },
                {
                    new : true
                }
            )
        }else if(emailType === RESET){
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    forgetPasswordToken : hashedToken,
                    forgetPasswordTokenExpiry : Date.now() + 3600000
                },
                {
                    new : true
                }
        )
        }
        const mailOptions = {
            from: 'rahul@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }
    
        const mailResponse = await transport.sendMail(mailOptions)
    
        return mailOptions
    } catch (error) {
        throw new ApiError(404 , error.message || "Something went worng while sending mail")
    }
}  

