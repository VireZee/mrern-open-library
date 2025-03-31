import type { Request, Response } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import Collection from '../../../models/Collection.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Delete = async (_: null, __: null, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const user = await User.findById(id)
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
        await Collection.deleteMany({ user_id: id })
        await User.findByIdAndDelete(id)
        await Redis.del(`collection:${id}*`)
        await Redis.del(`user:${id}`)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Delete