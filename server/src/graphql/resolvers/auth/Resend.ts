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
        const resendKey = `resend:${id}`
        const verifyKey = `verify:${id}`
        const isResendExist = await Redis.exists(resendKey)
        if (isResendExist === 0) {
            const randomString = crypto.randomBytes(64).toString('hex')
            const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
            await Redis.hset(verifyKey, { code: verificationCode })
            await Redis.expire(verifyKey, 300)
            await Redis.hset(resendKey, 'attempts', 1)
        }
        else {
            const getBlock = await Redis.hget(resendKey, 'block')
            if (getBlock) {
                const blockDate = new Date(getBlock)
                const timeDiff = Math.max(0, Math.floor((blockDate.getTime() - Date.now()) / 1000))
                if (timeDiff > 0) {
                    const hours = Math.floor(timeDiff / 3600)
                    const minutes = Math.floor((timeDiff % 3600) / 60)
                    const seconds = timeDiff % 60
                    const timeLeft = hours > 0
                        ? `${hours}h ${minutes}m ${seconds}s`
                        : minutes > 0
                            ? `${minutes}m ${seconds}s`
                            : `${seconds}s`
                    throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
                }
            }
            const getAttempts = await Redis.hget(resendKey, 'attempts')
            let attempts = Number(getAttempts!)
            if (attempts % 3 === 0) {
                const date = new Date()
                const blockDuration = 60 * 5 * (2 ** ((attempts / 3) - 1))
                date.setSeconds(date.getSeconds() + blockDuration)
                const blockUntil = date.toISOString()
                await Redis.hset(resendKey, 'block', blockUntil)
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
            const randomString = crypto.randomBytes(64).toString('hex')
            const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
            await Redis.hset(verifyKey, { code: verificationCode })
            await Redis.expire(verifyKey, 300)
            attempts = await Redis.hincrby(resendKey, 'attempts', 1)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default Resend