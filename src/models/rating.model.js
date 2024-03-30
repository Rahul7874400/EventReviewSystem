import mongoose, { Schema } from "mongoose";

const ratingSchema = new mongoose.Schema({
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event"
    },
    ratedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    registrationExperince : {
        type : Number,
        min : 1,
        max : 10,
        required : true
    },
    eventExperince : {
        type : Number,
        min : 1,
        max : 10,
        required : true
    },
    breakfastExperince : {
        type : Number,
        min : 1,
        max : 10
    },
    averageRating : {
        type : Number
    }
},{timestamps : true})

export const Rating = mongoose.model("Rating" , ratingSchema)