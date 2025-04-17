
import Redis from '@database/Redis.ts'
import type { User } from '@type/models/user.d.ts'
import checkBlockService from '@services/block.ts'
import rateLimiterService from '@services/rateLimiter.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import generateVerificationCode from '@utils/generator/generateVerificationCode.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user } = context
        const key = sanitizeRedisKey('resend', user._id)
        const getResend = await Redis.HGETALL(key)
        checkBlockService('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (!Object.keys(getResend).length) {
            await generateVerificationCode('verify', user)
            await Redis.HSET(key, 'attempts', 1)
        } else {
            checkBlockService('verify', user, 'Too many resend attempts! Try again in')
            rateLimiterService('resend', user, 60, 'verify')
        }
        await generateVerificationCode('verify', user)
        return true
    } catch (e) {
        throw e
    }
}
export default resend