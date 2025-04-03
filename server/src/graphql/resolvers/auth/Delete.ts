import type { Request, Response } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import Collection from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const Delete = async (_: null, __: null, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        await Collection.deleteMany({ user_id: id })
        await User.findByIdAndDelete(id)
        const keys = await Redis.keys(`*:${id}`)
        if (keys.length > 0) await Redis.del(...keys)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Delete