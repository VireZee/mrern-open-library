import type { Request } from 'express'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'

const Check = async (_: null, __: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const user = await User.findById(id)
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default Check