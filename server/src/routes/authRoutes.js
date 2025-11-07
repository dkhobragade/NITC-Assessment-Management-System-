import express from 'express'

const router = express.Router()

router.post('/auth/signup')
router.post('/auth/login')

export default router