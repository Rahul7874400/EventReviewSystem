import { Rating } from "../models/rating.model.js"
import { Event } from "../models/event.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"


const addRating = asyncHandler( async(req,res)=>{
    const {eventId} = req.params

    const aleadyRating  = await Rating.findOne({
        event : eventId,
        ratedBy : req?.user._id
    })

    if(aleadyRating){
        throw new ApiError(404 , "you rated already to the event")
    }

    const {registrationExperince , eventExperince , breakfastExperince} = req.body

    //validate experince
    if(isNaN(registrationExperince) || isNaN(eventExperince) || isNaN(breakfastExperince)){
        throw new ApiError(404 , "All feild are required and must be  number")
    }

    const event = await Event.findById(eventId)
    if(!event){
        throw new ApiError(404 , "Event does not exist")
    }

    const averave = parseFloat((parseInt(registrationExperince) + parseInt(eventExperince) + parseInt(breakfastExperince))/3)
    const createRating = await Rating.create({
        event : eventId,
        ratedBy : req?.user._id,
        registrationExperince : registrationExperince,
        eventExperince : eventExperince,
        breakfastExperince : breakfastExperince,
        averageRating : averave
    }) 

    await createRating.save()

    const existedRating = await Rating.findById(createRating._id)

    if(!existedRating){
        throw new ApiError(404 , "Something went worng while adding rating")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            existedRating,
            "User rate the event successfully"
        )
    )

} )

const deleteRating = asyncHandler( async(req,res)=>{
    const {userId , eventId} = req.params
   

    const rating = await Rating.findOneAndDelete({
        event : eventId,
        ratedBy : userId
    })

    if(!rating){
        throw new ApiError(404 , "rating does not exist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            rating,
            "Rating deleted successfully"
        )
    )
} )

const updateRating = asyncHandler( async(req,res)=>{
    const {userId , eventId} = req.params
    const {registrationExperince , eventExperince , breakfastExperince} = req.body

    if(isNaN(registrationExperince) || isNaN(eventExperince) || isNaN(breakfastExperince)){
        throw new ApiError(404 , "All feild are required and must be  number")
    }

    const averave = parseFloat((parseInt(registrationExperince) + parseInt(eventExperince) + parseInt(breakfastExperince))/3) 

    const rating = await Rating.findOneAndUpdate(
        {
            event : eventId,
            ratedBy : userId
        },
        {
            registrationExperince : registrationExperince,
            breakfastExperince : breakfastExperince,
            eventExperince : eventExperince,
            averageRating : averave
        }
    )

    if(!rating){
        throw new ApiError(404 , "rating does not exist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            rating,
            "Rating deleted successfully"
        )
    )
} )

const getEventRating = asyncHandler( async(req,res)=>{
    const {eventId} = req.params

    const rating = await Rating.aggregate([
        {
            $match : {
                event : new mongoose.Types.ObjectId(eventId)
            }
        },
        {
            $project : {
                registrationExperince : 1,
                breakfastExperince : 1,
                eventExperince : 1,
                averageRating : 1
            }
        }
    ])

    if(!rating){
        throw new ApiError(404 , "No rating exist for this event")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            rating,
            "Get all rating of the event"
        )
    )
} )

export {
    addRating,
    deleteRating,
    updateRating,
    getEventRating
}