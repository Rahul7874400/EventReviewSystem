import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    organisedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    flage : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

export const Event = mongoose.model("Event" , eventSchema)