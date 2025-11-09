import express from 'express'
import { approveFaculty, addCourse, getAllFaculty, getFacultyCount, getCoursesCount, assignCourse, getAvailableFaculties, getUnassignedCourses, getAssignedCourses } from '../controllers/adminControllers.js'

const router = express.Router()

router.put('/approve-faculty/:facultyId',approveFaculty)
router.get('/faculty-count',getFacultyCount)
router.get('/courses-count',getCoursesCount)
router.get('/faculties',getAllFaculty)

router.post('/add-course',addCourse)
router.post('/assign-course',assignCourse)

router.get("/available-faculties", getAvailableFaculties);
router.get("/unassigned-courses", getUnassignedCourses);
router.get("/assigned-courses", getAssignedCourses);


export default router