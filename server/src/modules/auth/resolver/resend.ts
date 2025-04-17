
import Redis from '@database/Redis.ts'
import checkBlockService from '@services/user/block.ts'
import rateLimiterService from '@services/user/rateLimiter.ts'
import generateVerificationCodeService from '@services/user/generateVerificationCode.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user } = context
        const key = sanitizeRedisKey('resend', user._id)
        const getResend = await Redis.HGETALL(key)
        checkBlockService('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (!Object.keys(getResend).length) {
            await generateVerificationCodeService('verify', user)
            await Redis.HSET(key, 'attempts', 1)
        } else {
            checkBlockService('verify', user, 'Too many resend attempts! Try again in')
            rateLimiterService('resend', user, 60, 'verify')
        }
        await generateVerificationCodeService('verify', user)
        return true
    } catch (e) {
        throw e
    }
}
export default resend