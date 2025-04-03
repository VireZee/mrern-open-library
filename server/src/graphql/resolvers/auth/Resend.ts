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
        const getResend = await Redis.hgetall(resendKey)
        const generateVerificationCode = async () => {
            const randomString = crypto.randomBytes(64).toString('hex')
            const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
            await Redis.hset(verifyKey, 'code', verificationCode)
            await Redis.call('HEXPIRE', verifyKey, 300, 'FIELDS', 1, 'code')
        }
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        const block = await Redis.hexists(verifyKey, 'block')
        if (block) {
            const blockTTL = await Redis.call('HTTL', verifyKey, 'FIELDS', 1, 'block') as number
            const timeLeft = formatTimeLeft(blockTTL)
            throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        }
        if (!getResend) {
            await generateVerificationCode()
            await Redis.hset(resendKey, 'attempts', 1)
        } else {
            const block = await Redis.hexists(resendKey, 'block')
            if (block) {
                const blockTTL = await Redis.call('HTTL', resendKey, 'FIELDS', 1, 'block') as number
                const timeLeft = formatTimeLeft(blockTTL)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            const increment = await Redis.hincrby(verifyKey, 'attempts', 1)
            if (increment % 3 === 0) {
                await Redis.hset(resendKey, 'block', '')
                const blockDuration = 60 * 60 * (2 ** ((increment / 3) - 1))
                await Redis.call('HEXPIRE', resendKey, blockDuration, 'FIELDS', 1, 'block')
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            await generateVerificationCode()
            await Redis.hincrby(resendKey, 'attempts', 1)
        }
        return true
    } catch (e) {
        if (e instanceof GraphQLError) {
            throw e
        }
        throw new GraphQLError('An unexpected error occurred', { extensions: { code: 500 } })
    }
}
export default Resend