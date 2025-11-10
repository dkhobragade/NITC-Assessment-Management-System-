import express from 'express'
import { protectRoute } from '../middlewares/authMiddleware.js'
import { enrollStudentByCode, getAllCoursesBasic, getStudentEnrollments, getStudentEnrollmentsWithTaskCount, getStudentResults, getTasksForCourse, getTasksForEnrolledCourse, studentUploadPDF } from '../controllers/studentControllers.js'
import parser from '../middlewares/upload.js'

const router = express.Router()

router.post('/enroll',protectRoute,enrollStudentByCode)

router.get('/my-task',protectRoute,getTasksForCourse)

router.get("/enrollments", protectRoute, getStudentEnrollments);

router.get("/enrollments-with-tasks", protectRoute, getStudentEnrollmentsWithTaskCount);

router.get("/course/:courseId/tasks", protectRoute, getTasksForEnrolledCourse);

router.post("/upload/:taskId", protectRoute, parser.single("file"), studentUploadPDF);


router.get("/results", protectRoute, getStudentResults);

router.get("/list", protectRoute, getAllCoursesBasic);

export default router