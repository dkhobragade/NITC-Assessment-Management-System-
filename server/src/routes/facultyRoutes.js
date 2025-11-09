import express from 'express'
import { approveEvalutor, approveStudent, approveUserByFaculty, createTask, getAllEvalutor, getAllStudent, getAssignedCoursesForFaculty } from '../controllers/facultyControllers.js'
import { protectRoute } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/task/create',protectRoute,createTask)
router.post('/evalutor-and-student',approveUserByFaculty)

router.put('/approve-evaluator/:evaluatorId',protectRoute, approveEvalutor)
router.put('/approve-student/:studentId',protectRoute, approveStudent)
router.get('/evalutors',protectRoute,getAllEvalutor)
router.get('/students',protectRoute,getAllStudent)
router.get("/assigned-courses", protectRoute, getAssignedCoursesForFaculty);

export default router