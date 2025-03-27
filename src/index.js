
import dotenv from "dotenv"
dotenv.config();
import connectDB from "./db/index.js";
import { app } from "./app.js";


connectDB()
.then(()=>{
    app.listen(process.env.PORT||5050,()=>{
        console.log(`Server is Running on port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB Connection failed !!", err);
})