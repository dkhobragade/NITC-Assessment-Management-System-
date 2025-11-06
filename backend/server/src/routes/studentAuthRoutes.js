import express from 'express'
import { enrollCourse, getMyCourses, studentLogin, studentLogout, studentSignup } from '../controllers/Student/authStudentControllers.js'


const router = express.Router()

router.post('/studentSignup',studentSignup)
router.post('/studentLogin',studentLogin)
router.post('/studentLogout',studentLogout)

router.post('/enroll',enrollCourse)

router.post("/my-courses", getMyCourses);


export default router