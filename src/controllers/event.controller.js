import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Event } from "../models/event.model.js"
import { Report } from "../models/report.model.js"
import mongoose from "mongoose"

const organiseEvent = asyncHandler( async(req,res)=>{
    const {eventName} = req.body

    // const user = await User.findById(userId)
    // if(!user){
    //     throw new ApiError(404 , "user does not exist")
    // }

    const event = await  Event.create({
        organisedBy : req?.user._id,
        eventName : eventName
    })

    await event.save()


    return res
    .status(202)
    .json(
        new ApiResponse(
            201,
            event,
            "Event created successfully"
        )
    )

} )

const deleteEvent = asyncHandler( async(req,res)=>{
    const {eventId} = req.params

    const event = await Event.findByIdAndDelete(eventId)

    if(!event){
        throw new ApiError(404 , "Event does not exist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            event,
            "Event deleted successfully"
        )
    )
} )

const getEventByUserId = asyncHandler( async(req,res)=>{
   // const {userId} = req.params

    // const user = await User.findById(userId)

    // if(!user){
    //     throw new ApiError(404 , "User does not exist")
    // }

    //console.log("user" , user)

    const event = await Event.aggregate([
        {
            $match : {
                organisedBy : new mongoose.Types.ObjectId(req?.user._id)
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
            "Got all event"
        )
    )
} )

const checkReportedEvent = asyncHandler( async(req,res)=>{
    //const {eventId} = req.params
    const reportedEvent = await Report.aggregate([
        {
            $group : {
                _id : "$event",
                count : {
                    $sum : 1
                }
            }
        },
        {
           $match : {
            count : {
                $gt : 5
            }
           } 
        },
        {
            $project : {
                event : 1
            }
        }
    ])

    if(!reportedEvent){
        throw new ApiError(404 , "Something went worng while removing the reported event")
    }

    return res
    .status(202)
    .json(
        new ApiResponse(
            201,
            reportedEvent,
            "flaged the reported event"
        )
    )
} )

export {
    organiseEvent,
    deleteEvent,
    getEventByUserId,
    checkReportedEvent
}
