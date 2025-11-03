import express from 'express'
import dotenv from "dotenv";
import adminAuthRoutes from '../src/routes/adminAuthRoutes.js'
import facultyAuthRoutes from '../src/routes/facultyAuthRoutes.js'
import evalutorAuthRoutes from '../src/routes/evaluatorAuthRoutes.js'
import studentAuthRoutes from '../src/routes/studentAuthRoutes.js'

import { connectDB } from './config/db.js';
import cookieparser from "cookie-parser";
import cors from 'cors'

dotenv.config();
const app = express()

const PORT = process.env.PORT

app.use(
  cors({
    origin: "http://localhost:5173", // your React app’s URL
    credentials: true, // allows cookies if you use them
  })
);

app.use(cookieparser())
app.use(express.json())

app.use("/api/adminAuth",adminAuthRoutes)
app.use("/api/facultyAuth",facultyAuthRoutes)
app.use("/api/evalutorAuth",evalutorAuthRoutes)
app.use("/api/studentAuth",studentAuthRoutes)

app.listen(PORT,()=>{
    console.log("Server is running on http://localhost:" + PORT);
    connectDB()
})