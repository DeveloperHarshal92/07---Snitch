import express from "express"
import morgan from "morgan"
import authRouter from "../routes/auth.routes.js"

const app = express()
 
// Middleware
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to Snitch API")
})
app.use("/api/auth", authRouter)

export default app