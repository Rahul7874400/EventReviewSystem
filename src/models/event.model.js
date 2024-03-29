import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    organisedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    eventName : {
        type : String,
        required : true
    },
    flage : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

export const Event = mongoose.model("Event" , eventSchema)