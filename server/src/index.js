import express from 'express'
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import authRoutes from '../src/routes/authRoutes.js'
import adminRoutes from '../src/routes/adminRoutes.js'
import cors from 'cors'

dotenv.config();
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
app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
