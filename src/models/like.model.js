import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event"
    },
    likedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

export const Like = mongoose.model("Like" , likeSchema)