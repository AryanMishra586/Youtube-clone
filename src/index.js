import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()// async functions hamesa promise return karte toh ya fir then catch karo ya toh ek aur await lagao
.then(()=>{
    app.on("Error",(error)=>{
        console.log("ERRR :",error)
        throw error
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(` Server is running at ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongo DB coonection failed !!", err)
})
