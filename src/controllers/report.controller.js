import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Report } from "../models/report.model.js"
import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Event } from "../models/event.model.js"

// report the event if event is not reported of unreport if event is reported
const toggleEventReport = asyncHandler( async(req,res)=>{
    const {eventId} = req.params

    const alreadyReportedOrNot = await Report.findOne({
        event : eventId
    })

    if(!alreadyReportedOrNot){
        const createReport = await Report.create({
            event : eventId,
            reportBy : req?.user._id
        })

        if(!createReport){
            throw new ApiError(404 , "Something worng while reporting the event")
        }
        return res
        .status(202)
        .json(
            new ApiResponse(
                201,
                createReport,
                "Event reported successfully"
            )
        )
    }

    else{
        const deleteReport = await Report.deleteOne({
            event : eventId
        })

        if(!deleteReport){
            throw new ApiError(404 , "Something went worng while deleting the reporting")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                deleteReport,
                "Report deleted successfully"
            )
        )
    }
} )

const getReportedEvent = asyncHandler( async(req,res)=>{
    // const {userId} = req.params

    // const user = await User.findById(userId)

    // if(!user){
    //     throw new ApiError(404 , "User does not exist")
    // }

    const event = await Event.aggregate([
        {
            $match : {
                organisedBy : new mongoose.Types.ObjectId(req?.user._id)
            }
        },
        {
            $lookup : {
                from : "report",
                localField : "_id",
                foreignField : "event",
                as : "reportedEvent"
            }
        },
        {
            $project : {
                eventName : 1
            }
        }
    ])

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            event,
            "Get all reported event"
        )
    )
} )


export {
    toggleEventReport,
    getReportedEvent
}