import express from 'express'
import { check, forgetPassword, login, logout, resetPassword, signup } from '../controllers/authControllers.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgot-password',forgetPassword)
router.post('/reset-password',resetPassword)

router.get("/check", protectRoute, check);

export default router