import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Resend = async (_: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const redisKey = `resend:${id}`
        const resend = await Redis.exists(redisKey)
        if (resend === 0) await Redis.hset(redisKey, 'attempts', 1)
        else {
            const getAttempts = await Redis.hget(redisKey, 'attempts')
            let attempts = parseInt(getAttempts!)
            if (attempts % 3 === 0) {
                const blockUntil = new Date()
                const blockDuration = 60 * 5 * (2 ** ((attempts / 3) - 1))
                blockUntil.setSeconds(blockUntil.getSeconds() + blockDuration)
                await Redis.hset(redisKey, 'block', blockUntil.toISOString())
                const hours = Math.floor(blockDuration / 3600)
                const minutes = Math.floor((blockDuration % 3600) / 60)
                const seconds = blockDuration % 60
                const timeLeft = hours > 0
                    ? `${hours}h ${minutes}m ${seconds}s`
                    : minutes > 0
                        ? `${minutes}m ${seconds}s`
                        : `${seconds}s`
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            attempts = await Redis.hincrby(redisKey, 'attempts', 1)
        }
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
export default Resend