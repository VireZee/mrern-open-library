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
        const generateVerificationCode = async () => {
            const randomString = crypto.randomBytes(64).toString('hex')
            const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
            await Redis.hset(verifyKey, { code: verificationCode })
            await Redis.expire(verifyKey, 300)
        }
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        if (isResendExist === 0) {
            await generateVerificationCode()
            await Redis.hset(resendKey, 'attempts', 1)
        } else {
            const block = await Redis.hget(resendKey, 'block')
            const attempts = Number(await Redis.hget(resendKey, 'attempts'))
            if (block) {
                const blockDate = new Date(block)
                const timeDiff = Math.max(0, Math.floor((blockDate.getTime() - Date.now()) / 1000))
                if (timeDiff > 0) {
                    const timeLeft = formatTimeLeft(timeDiff)
                    throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
                }
            } if (attempts % 3 === 0) {
                const date = new Date()
                const blockDuration = 60 * 60 * (2 ** ((attempts / 3) - 1))
                date.setSeconds(date.getSeconds() + blockDuration)
                const blockUntil = date.toISOString()
                await Redis.hset(resendKey, 'block', blockUntil)
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            await generateVerificationCode()
            await Redis.hincrby(resendKey, 'attempts', 1)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default Resend