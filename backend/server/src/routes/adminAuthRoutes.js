import express from 'express'
import { adminSignup , adminLogin, adminLogout, getAllFacultyData, approveFaculty} from '../controllers/Admin/authAdminControllers.js'

const router =express.Router()

router.post('/adminSignup',adminSignup)
router.post('/adminLogin',adminLogin)
router.post('/adminLogout',adminLogout)

router.post('/adminApproveFaculty',approveFaculty)

router.get('/adminGetAllFaculty',getAllFacultyData)

export default router