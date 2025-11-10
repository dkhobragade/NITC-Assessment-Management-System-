import express from 'express'
import { approveEvalutor, approveStudent, approveUserByFaculty, createTask, exportEvaluatorExcel, exportStudentsExcel, generateFacultyReport, getAllEvalutor, getAllStudent, getAssignedCoursesForFaculty,  getTasks,  saveSingleMapping, studentUploadPDF, uploadExcelAndMap } from '../controllers/facultyControllers.js'
import { protectRoute } from '../middlewares/authMiddleware.js'
import parser from '../middlewares/upload.js';
import multer from 'multer';

const router = express.Router()

router.post('/evalutor-and-student',approveUserByFaculty)

router.put('/approve-evaluator/:evaluatorId',protectRoute, approveEvalutor)
router.put('/approve-student/:studentId',protectRoute, approveStudent)
router.get('/evalutors',protectRoute,getAllEvalutor)
router.get('/students',protectRoute,getAllStudent)
router.get("/assigned-courses", protectRoute, getAssignedCoursesForFaculty);


router.post('/create-task',protectRoute,parser.single('pdfFile'),createTask)
router.post("/upload/:taskId", protectRoute, parser.single("pdfFile"), studentUploadPDF);
router.get("/task", protectRoute, getTasks);

router.get('/export-students',protectRoute,exportStudentsExcel)
router.get('/export-evaluator',protectRoute,exportEvaluatorExcel)

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-excel", protectRoute, upload.fields([
  { name: "evaluators", maxCount: 1 },
  { name: "students", maxCount: 1 }
]), uploadExcelAndMap);

router.post("/save-mappings",protectRoute,saveSingleMapping)

router.get("/generate-report", protectRoute, generateFacultyReport);

export default router