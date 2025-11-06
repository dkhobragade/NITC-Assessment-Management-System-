import express from 'express'
import { approveEvalutor,  approveStudent,  createTask,  facultyLogin, facultyLogout, facultySignup, getAllEvalutorData, getAllStudentData, getAllTask, getAssignedCourses, getTotalEvalutor, getTotalTask, upload } from '../controllers/Faculty/authFacultyControllers.js'
import { randomMapping, uploadExcelFiles } from '../controllers/Faculty/mapEvaluatorController.js'


const router = express.Router()

router.post('/facultySignup',facultySignup)
router.post('/facultyLogin',facultyLogin)
router.post('/facultyLogout',facultyLogout)

router.post("/create-task", upload.single("pdf"), createTask);

router.post('/facultyApproveEvalutor',approveEvalutor)

router.post('/facultyApproveStudent',approveStudent)

router.get('/getAllEvalutor',getAllEvalutorData)

router.get('/getAllStudent',getAllStudentData)

router.post('/task-count',getTotalTask)

router.get('/getTotalEvalutor',getTotalEvalutor)

router.post('/all-tasks',getAllTask)

router.post(
  "/upload-excel",
  upload.fields([
    { name: "evaluator", maxCount: 1 },
    { name: "student", maxCount: 1 },
  ]),
  uploadExcelFiles
);

router.post("/random-map", randomMapping);

router.post("/get-assigned-courses", getAssignedCourses);


export default router