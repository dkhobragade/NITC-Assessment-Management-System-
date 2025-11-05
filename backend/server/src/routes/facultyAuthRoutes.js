import express from 'express'
import { approveEvalutor, createdTask, facultyLogin, facultyLogout, facultySignup, getAllEvalutorData, getTotalEvalutor } from '../controllers/Faculty/authFacultyControllers.js'


const router = express.Router()

router.post('/facultySignup',facultySignup)
router.post('/facultyLogin',facultyLogin)
router.post('/facultyLogout',facultyLogout)

router.post('/facultyCreatedTask',createdTask)

router.post('/facultyApproveEvalutor',approveEvalutor)

router.get('/getAllEvalutor',getAllEvalutorData)

router.get('/getTotalEvalutor',getTotalEvalutor)


export default router