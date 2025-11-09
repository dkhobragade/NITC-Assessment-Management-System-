import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import { connectDB } from './config/db.js';
import authRoutes from '../src/routes/authRoutes.js'
import adminRoutes from '../src/routes/adminRoutes.js'
import facultyRoutes from '../src/routes/facultyRoutes.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieparser());

app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/faculty',facultyRoutes)

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
