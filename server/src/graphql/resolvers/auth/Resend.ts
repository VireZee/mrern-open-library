import type { Request } from 'express'
import Redis from '../../../database/Redis.ts'
import { verifyToken } from '../../../utils/Validation.ts'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'

const Resend = async (_: null, context: { req: Request }) => {
    const { req } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const redisResendKey = `resend:${id}`
        const redisVerifyKey = `verify:${id}`
        const randomString = crypto.randomBytes(64).toString('hex')
        const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
        const resend = await Redis.exists(redisResendKey)
        if (resend === 0) {
            await Redis.hset(redisVerifyKey, { code: verificationCode })
            await Redis.expire(redisVerifyKey, 300)
            await Redis.hset(redisResendKey, 'attempts', 1)
        }
        else {
            const getAttempts = await Redis.hget(redisResendKey, 'attempts')
            let attempts = Number(getAttempts!)
            if (attempts % 3 === 0) {
                const block = await Redis.hget(redisResendKey, 'block')
                const date = new Date()
                const blockDuration = 60 * 5 * (2 ** ((attempts / 3) - 1))
                date.setSeconds(date.getSeconds() + blockDuration)
                await Redis.hset(redisResendKey, 'block', date.toISOString())
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
            await Redis.hset(redisVerifyKey, { code: verificationCode })
            await Redis.expire(redisVerifyKey, 300)
            attempts = await Redis.hincrby(redisResendKey, 'attempts', 1)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default Resend