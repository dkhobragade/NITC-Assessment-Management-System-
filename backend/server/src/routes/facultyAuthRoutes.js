import express from 'express'
import { facultyLogin, facultyLogout, facultySignup } from '../controllers/Faculty/authFacultyControllers.js'


const router = express.Router()

router.post('/facultySignup',facultySignup)
router.post('/facultyLogin',facultyLogin)
router.post('/facultyLogout',facultyLogout)

export default router