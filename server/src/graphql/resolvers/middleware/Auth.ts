import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Auth = async (_: null, __: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    if (!t) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
    try {
        const { id } = verifyToken(t)
        const userCache = await Redis.call('JSON.GET', `user:${id}`) as string
        const mapUserToResponse = (userData: { photo: Buffer, name: string, username: string, email: string }) => ({
            photo: Buffer.from(userData.photo).toString('base64'),
            name: userData.name,
            uname: userData.username,
            email: userData.email
        })
        if (userCache) return mapUserToResponse(JSON.parse(userCache))
        const user = await User.findById(id)
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        await Redis.call('JSON.SET', `user:${id}`, '$', JSON.stringify({
            photo: user.photo.toString(),
            name: user.name,
            username: user.username,
            email: user.email
        }))
        await Redis.expire(`user:${id}`, 86400)
        return mapUserToResponse(user)
    } catch (e) {
        throw e
    }
}
export default Auth