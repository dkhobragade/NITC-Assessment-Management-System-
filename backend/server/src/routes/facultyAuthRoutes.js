import express from 'express'
import { approveEvalutor, createdTask, facultyLogin, facultyLogout, facultySignup } from '../controllers/Faculty/authFacultyControllers.js'


const router = express.Router()

router.post('/facultySignup',facultySignup)
router.post('/facultyLogin',facultyLogin)
router.post('/facultyLogout',facultyLogout)

router.post('/facultyCreatedTask',createdTask)

router.post('/facultyApproveEvalutor',approveEvalutor)

export default router