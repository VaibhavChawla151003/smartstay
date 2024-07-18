import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'https://smartstay-coral.vercel.app/',
    credentials: true,
  }))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import 
import userRouter from './routes/user.routes.js'
import listingRouter from './routes/listing.routes.js'
import bookingRouter from './routes/booking.routes.js'

//routes declaration

// http://localhost:8000/api/v1/users/register

app.use("/api/v1/users", userRouter) // will activate userRouter
app.use("/api/v1/listings", listingRouter) // will activate userRouter
app.use("/api/v1/bookings", bookingRouter) // will activate userRouter

export {app};