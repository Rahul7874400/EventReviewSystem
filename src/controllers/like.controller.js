import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/like.model.js"
import { Event } from "../models/event.model.js"
import mongoose from "mongoose"
import { User } from "../models/user.model.js"

// like the event if event is not liked or remove the like if event is already liked
const toggleEventLike = asyncHandler( async(req,res)=>{
    const {eventId} = req.params

    const alreadyExistedLike = await Like.findOne({
        event : eventId,
        likedBy : req?.user._id
    })

    if(!alreadyExistedLike){
        const like = await Like.create({
            event : eventId,
            likedBy : req?.user._id
        })

        if(!like){
            throw new ApiError(404 , "Something went worng while liking the Event")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                like,
                "Successfully like the event"
            )
        )
    }

    else{
        const disLike = await Like.findOneAndDelete({
            event : eventId,
            likedBy : req?.user._id
        })

        if(!disLike){
            throw new ApiError(404 , "Something went worng while disliking the event")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                disLike,
                "user dislike the event successfully"
            )
        )
    }
} )


// like the rating if rating is already liked or remove the like if rating is not liked
const toggleRatingLike = asyncHandler( async(req,res)=>{

    const {ratingId} = req.params

    const alreadyExistedLike = await Like.findOne({
        rating : ratingId,
        likedBy : req?.user._id
    })

    if(!alreadyExistedLike){
        const like = await Like.create({
            rating : ratingId,
            likedBy : req?.user._id
        })

        if(!like){
            throw new ApiError(404 , "Something went worng while liking the rating")
        }

        return res
        .status(202)
        .json(
            new ApiResponse(
                201,
                like,
                "User liked the rating succesfully"
            )
        )
    }
    else{
        const disLike = await Like.findOneAndDelete({
            rating : ratingId,
            likedBy : req?.user._id
        })

        if(!disLike){
            throw new ApiError(404 , "Something worng while disliking the rating")
        }

        return res
        .status(202)
        .json(
            new ApiResponse(
                201,
                disLike,
                "User dislike the rating succesfully"
            )
        )
    }

} )

// Get the all Liked Event 
const getLikedEvent = asyncHandler( async(req,res)=>{

    const event = await Like.aggregate([
        {
            $match : {
                likedBy : new mongoose.Types.ObjectId(req?.user._id)
            }
        },
        {
            $lookup : {
                from : "events",
                localField : "event",
                foreignField : "_id",
                as : "likedEvent"
            }
        },
        {
            $unwind : "$likedEvent"
        },
        {
            $project : {
                likedEvent : 1
            }
        }
    ])

    if(!event){
        throw new ApiError(404 , "Something went worng while geting event")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            event,
            "get the liked event"
        )
    )
} )

/// Get the all Liked rating
const getLikeRating = asyncHandler( async(req,res)=>{

    const rating = await Like.aggregate([
        {
            $match : {
                likedBy : new mongoose.Types.ObjectId(req?.user._id)
            }
        },
        {
            $lookup : {
                from : "ratings",
                localField : "rating",
                foreignField : "_id",
                as : "likedRating"
            }
        },
        {
            $unwind : "$likedRating"
        },
        {
            $project : {
                likedRating : 1
            }
        }
    ])

    if(!rating){
        throw new ApiError(404 , "Something went worng while getting the rating")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            rating,
            "Get all liked rating"
        )
    )
} )

export {
    toggleEventLike,
    toggleRatingLike,
    getLikedEvent,
    getLikeRating
}
