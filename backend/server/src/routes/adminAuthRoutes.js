import express from 'express'
import { adminSignup , adminLogin, adminLogout} from '../controllers/Admin/authAdminControllers.js'

const router =express.Router()

router.post('/adminSignup',adminSignup)
router.post('/adminLogin',adminLogin)
router.post('/adminLogout',adminLogout)

export default router