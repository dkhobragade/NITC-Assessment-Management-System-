import express from 'express'
import { evalutorLogin, evalutorLogout, evalutorSignup, getAllStudentData } from '../controllers/Evalutor/authEvalutoControllers.js'
import { getAllEvalutorData } from '../controllers/Faculty/authFacultyControllers.js'


const router =express.Router()

router.post('/evalutorSignup',evalutorSignup)
router.post('/evalutorLogin',evalutorLogin)
router.post('/evalutorLogout',evalutorLogout)

// router.post('/FacultyApproveEvalutor',approveFaculty)

router.get('/getAllEvalutor',getAllEvalutorData)

router.get('/evalutorGetAllStudent',getAllStudentData)


export default router