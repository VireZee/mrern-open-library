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
        const verifyKey = `verify:${id}`
        const blockKey = `block:${id}`
        const data = await Redis.hgetall(verifyKey)
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        if (!data) throw new GraphQLError('Verification code expired!', { extensions: { code: '400' } })
        const block = await Redis.get(blockKey)
        if (block) {
            const blockTTL = await Redis.ttl(blockKey)
            const timeLeft = formatTimeLeft(blockTTL)
            throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        }
        const attempts = Number(data['attempts'])
        if (code !== data['code']) {
            await Redis.hincrby(verifyKey, 'attempts', 1)
            if (attempts % 3 === 0) {
                const blockDuration = 60 * 30 * (2 ** (((attempts + 1) / 3) - 1))
                await Redis.setex(blockKey, blockDuration, '')
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        }
        const newCachedUser = await User.findByIdAndUpdate(id, { verified: true }, { new: true })
        await Redis.call('JSON.SET', `user:${id}`, '$.verified', `${newCachedUser!.verified}`)
        await Redis.del(verifyKey, blockKey, `resend:${id}`)
        // else if (resend exist) {
        // const resendTTL = await Redis.ttl(`resend:${id}`)
        // if (resendTTL > 0) {
        //     const hours = Math.floor(resendTTL / 3600)
        //     const minutes = Math.floor((resendTTL % 3600) / 60)
        //     const seconds = resendTTL % 60
        //     const timeLeft = hours > 0
        //         ? `${hours}h ${minutes}m ${seconds}s`
        //         : minutes > 0
        //         ? `${minutes}m ${seconds}s`
        //         : `${seconds}s`
        //         throw new GraphQLError(`Please wait ${timeLeft} before requesting a new code!`, { extensions: { code: 429 } })
        //     }
        // }
        // const blockTTL = await Redis.ttl(`block:${id}`)
        // if (blockTTL > 0) {
        //     const hours = Math.floor(blockTTL / 3600)
        //     const minutes = Math.floor((blockTTL % 3600) / 60)
        //     const seconds = blockTTL % 60
        //     const timeLeft = hours > 0
        //         ? `${hours}h ${minutes}m ${seconds}s`
        //         : minutes > 0
        //             ? `${minutes}m ${seconds}s`
        //             : `${seconds}s`
        //     throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        // }
        // await Redis.hsetnx(`verify:${id}`, 'attempts', 1)
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
        return true
    } catch (e) {
        throw e
    }
}
export default Verify