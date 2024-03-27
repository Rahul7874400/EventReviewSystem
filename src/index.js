import dotenv from "dotenv"
import connectDb from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path : './.evn'
})


connectDb()
.then( ()=>{

    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server running at ${process.env.PORT}`)
    })
} )
.catch( (error)=>{
    console.log("MongoDB connection Failed !! ",error)
} )