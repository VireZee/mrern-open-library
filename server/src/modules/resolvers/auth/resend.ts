
import Redis from '@database/Redis.ts'
import type { User } from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'
import generateVerificationCode from '@utils/misc/generateVerificationCode.ts'
import formatTimeLeft from '@utils/formatter/timeLeft.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user } = context
        const resendKey = sanitizeRedisKey('resend', user._id)
        const verifyKey = sanitizeRedisKey('verify', user._id)
        const getResend = await Redis.HGETALL(resendKey)
        const block = await Redis.HEXISTS(verifyKey, 'block')
        if (block) {
            const blockTTL = await Redis.HTTL(verifyKey, 'block')
            const timeLeft = formatTimeLeft(blockTTL![0]!)
            throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        }
        if (!Object.keys(getResend).length) {
            await generateVerificationCode(verifyKey, user)
            await Redis.HSET(resendKey, 'attempts', 1)
        } else {
            const block = await Redis.HEXISTS(resendKey, 'block')
            if (block) {
                const blockTTL = await Redis.HTTL(resendKey, 'block')
                const timeLeft = formatTimeLeft(blockTTL![0]!)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            const increment = await Redis.HINCRBY(resendKey, 'attempts', 1)
            if (increment % 3 === 0) {
                await Redis.HDEL(verifyKey, 'code')
                await Redis.HSET(resendKey, 'block', '')
                const blockDuration = 60 * 60 * (2 ** ((increment / 3) - 1))
                await Redis.HEXPIRE(resendKey, 'block', blockDuration)
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
        }
        await generateVerificationCode(verifyKey, user)
        return true
    } catch (e) {
        throw e
    }
}
export default resend