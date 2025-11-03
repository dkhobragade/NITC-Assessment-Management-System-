import express from 'express'
import { facultyLogin, facultySignup } from '../controllers/Faculty/authFacultyControllers.js'


const router = express.Router()

router.post('/facultySignup',facultySignup)
router.post('/facultyLogin',facultyLogin)

export default router