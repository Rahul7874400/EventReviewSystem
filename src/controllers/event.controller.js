import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Event } from "../models/event.model.js"

const organiseEvent = asyncHandler( async(req,res)=>{
    const{userId} = req.params
    const {eventName} = req.body

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404 , "user does not exist")
    }

    const event = await  Event.create({
        organisedBy : userId,
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

    const event = Event.findByIdAndDelete(eventId)

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
    const {userId} = req.params

    const event = Event.aggregate[
        {
            $match : {
                organisedBy : userId
            }
        },
        {
            $project : {
                eventName : 1
            }
        }
    ]

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

} )

export {
    organiseEvent,
    deleteEvent,
    getEventByUserId,
    checkReportedEvent
}
