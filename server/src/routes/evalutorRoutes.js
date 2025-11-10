import express from 'express'
import { protectRoute } from '../middlewares/authMiddleware.js';
import { assignMarksToStudent, generateEvaluatorReport, getAllTasks, getAssignedStudentsCount, getAssignedStudentsForTask, getAssignedStudentsWithDetails, getSubmittedTasksForEvaluator } from '../controllers/evaluatorControllers.js';

const router = express.Router()

router.get("/all-tasks", protectRoute, getAllTasks);
router.get("/assigned-students-count", protectRoute, getAssignedStudentsCount);

router.get("/assigned-students/:taskId", protectRoute, getAssignedStudentsForTask);

router.post("/assign-marks/:submissionId", protectRoute, assignMarksToStudent);

router.get("/submitted-tasks", protectRoute, getSubmittedTasksForEvaluator);


router.get("/assigned-students", protectRoute, getAssignedStudentsWithDetails);

router.get("/generate-report", protectRoute, generateEvaluatorReport);

export default router