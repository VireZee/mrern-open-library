import { Router } from 'express'
import apiController from '@controller/booksParent.ts'
import verifyController from '@controller/verify.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/api/:hash', apiController)
router.get('/verify/:userId/:token', verifyController)
export default router