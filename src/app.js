
import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//Route import

import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import categoryRouter from "./routes/category.routes.js"

//route decration 

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/category", categoryRouter)
//http://localhost:5050/api/v1/users/register

export { app }