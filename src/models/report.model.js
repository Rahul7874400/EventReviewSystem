import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event"
    },
    reportBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})


export const Report = mongoose.model("Report" , reportSchema)