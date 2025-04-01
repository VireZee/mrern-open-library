import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Verify = async (_: null, args: { code: string }, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { code } = args
        const redisKey = `verify:${id}`
        const data = await Redis.hgetall(redisKey)
        if (!data) throw new GraphQLError('Verification code expired!', { extensions: { code: '400' } })
        await Redis.hsetnx(`verify:${id}`, 'attempts', 1)
        // const attempts = await Redis.hincrby(`verify:${id}`, 'attempts', 1)
        // if (attempts % 3 === 0) {
        //     const blockDuration = 60 * 30 * (2 ** ((attempts / 3) - 1))
        //     await Redis.setex(`block:${id}`, blockDuration, '')
        //     const hours = Math.floor(blockDuration / 3600)
        //     const minutes = Math.floor((blockDuration % 3600) / 60)
        //     const seconds = blockDuration % 60
        //     const timeLeft = hours > 0
        //         ? `${hours}h ${minutes}m ${seconds}s`
        //         : minutes > 0
        //             ? `${minutes}m ${seconds}s`
        //             : `${seconds}s`
        //     throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        // }

        if (user!.verificationCode !== code) throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        else if (user!.codeExpiresAt! < new Date()) throw new GraphQLError('Verification code expired!', { extensions: { code: '400' } })
        const newCachedUser = await User.findByIdAndUpdate(id, {
            verified: true,
            verificationCode: null,
            codeExpiresAt: null
        }, { new: true })
        await Redis.call('JSON.SET', `user:${id}`, '$.verified', `${newCachedUser!.verified}`)
        return true
    } catch (e) {
        throw e
    }
}
export default Verify