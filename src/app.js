
import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
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
import adminRouter from "./routes/admin.routes.js"

//route decration 
 
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/admins", adminRouter )


//http://localhost:5050/api/v1/users/register

export { app }