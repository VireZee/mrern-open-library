import { Router } from 'express'
import apiController from '@controller/booksParent.ts'

const router = Router({
    caseSensitive: true,
    strict: true
})
router.get('/api/:hash', apiController)
export default router