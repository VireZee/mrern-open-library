import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Auth = async (_: null, __: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    if (!t) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
    const formatUserResponse = (userData: { photo: Buffer, name: string, username: string, email: string, verified: boolean }) => ({
        photo: Buffer.from(userData.photo).toString('base64'),
        name: userData.name,
        uname: userData.username,
        email: userData.email,
        verified: userData.verified
    })
    try {
        const { id } = verifyToken(t)
        const redisKey = `user:${id}`
        const cachedUser = await Redis.call('JSON.GET', redisKey) as string
        if (cachedUser) return formatUserResponse(JSON.parse(cachedUser))
        const user = await User.findById(id)
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: 401 } })
        await Redis.call('JSON.SET', redisKey, '$', JSON.stringify({
            photo: user.photo.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            verified: user.verified
        }))
        await Redis.expire(redisKey, 86400)
        return formatUserResponse(user)
    } catch (e) {
        throw e
    }
}
export default Auth