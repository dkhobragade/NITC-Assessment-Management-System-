import express from 'express'
import { studentLogin, studentLogout, studentSignup } from '../controllers/Student/authStudentControllers.js'


const router = express.Router()

router.post('/studentSignup',studentSignup)
router.post('/studentLogin',studentLogin)
router.post('/studentLogout',studentLogout)


export default router