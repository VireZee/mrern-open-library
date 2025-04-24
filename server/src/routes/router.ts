import { Router } from 'express'
import apiController from '@controller/booksParent.ts'
import verifyController from '@controller/verify.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/api/:token', apiController)
router.get('/verify/:id/:token', verifyController)
export default router