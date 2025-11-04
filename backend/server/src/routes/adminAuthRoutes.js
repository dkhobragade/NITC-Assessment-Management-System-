import express from 'express'
import { adminSignup , adminLogin, adminLogout, getAllFacultyData, approveFaculty, addCourses, assignCourse, getAllCourseData} from '../controllers/Admin/authAdminControllers.js'

const router =express.Router()

router.post('/adminSignup',adminSignup)
router.post('/adminLogin',adminLogin)
router.post('/adminLogout',adminLogout)

router.post('/adminApproveFaculty',approveFaculty)

router.get('/adminGetAllFaculty',getAllFacultyData)

router.get('/adminGetAllCourse',getAllCourseData)

router.post('/adminAddCourses',addCourses)

router.post('/adminAssignCourse',assignCourse)

export default router