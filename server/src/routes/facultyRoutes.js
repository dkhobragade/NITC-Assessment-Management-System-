import express from 'express'
import { approveUserByFaculty } from '../controllers/facultyControllers.js'

const router = express.Router()

router.post('/faculty/task/create')
router.post('/faculty/evalutor-and-student',approveUserByFaculty)

export default router