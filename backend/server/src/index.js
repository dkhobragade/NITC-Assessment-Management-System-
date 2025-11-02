import express from 'express'
import dotenv from "dotenv";
import authRoutes from '../src/routes/authRoutes.js'
import { connectDB } from './config/db.js';

dotenv.config();
const app = express()

const PORT = process.env.PORT


app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    console.log("Server is running on http://localhost:" + PORT);
    connectDB()
})