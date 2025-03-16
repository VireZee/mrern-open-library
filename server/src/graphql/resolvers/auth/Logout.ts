import type { Request, Response } from 'express'
import Redis from '../../../database/Redis.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const Logout = async (_: null, __: null, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        await Redis.del(`user:${id}`)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Logout