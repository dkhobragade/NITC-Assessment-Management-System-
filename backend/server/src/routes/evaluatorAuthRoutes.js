import express from 'express'
import { evalutorLogin, evalutorLogout, evalutorSignup } from '../controllers/Evalutor/authEvalutoControllers.js'
import { getAllEvalutorData } from '../controllers/Faculty/authFacultyControllers.js'


const router =express.Router()

router.post('/evalutorSignup',evalutorSignup)
router.post('/evalutorLogin',evalutorLogin)
router.post('/evalutorLogout',evalutorLogout)

// router.post('/FacultyApproveEvalutor',approveFaculty)

router.get('/getAllEvalutor',getAllEvalutorData)


export default router