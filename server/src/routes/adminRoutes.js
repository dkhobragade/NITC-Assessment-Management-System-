import express from 'express'
import { approveFaculty, addCourse, getAllFaculty, getFacultyCount, getCoursesCount, assignCourse, getAvailableFaculties, getUnassignedCourses, getAssignedCourses } from '../controllers/adminControllers.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.put('/approve-faculty/:facultyId',protectRoute, approveFaculty)
router.get('/faculty-count',protectRoute,getFacultyCount)
router.get('/courses-count',protectRoute,getCoursesCount)
router.get('/faculties',protectRoute,getAllFaculty)

router.post('/add-course',protectRoute,addCourse)
router.post('/assign-course',protectRoute,assignCourse)

router.get("/available-faculties", protectRoute,getAvailableFaculties);
router.get("/unassigned-courses", protectRoute,getUnassignedCourses);
router.get("/assigned-courses", protectRoute,getAssignedCourses);


export default router