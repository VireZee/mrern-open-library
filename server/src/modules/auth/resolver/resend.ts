import Redis from '@database/Redis.ts'
import checkBlockService from '@services/account/block.ts'
import rateLimiterService from '@services/verification/rateLimiter.ts'
import generateCodeService from '@services/verification/generateCode.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user } = context
        const key = sanitizeRedisKey('resend', user._id)
        const getResend = await Redis.HGETALL(key)
        await checkBlockService('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (!Object.keys(getResend).length) {
            await generateCodeService('verify', user)
            await Redis.HSET(key, 'attempts', 1)
        } else {
            await checkBlockService('resend', user, 'Too many resend attempts! Try again in')
            await rateLimiterService('resend', user, 60, 'verify')
        }
        await generateCodeService('verify', user)
        return true
    } catch (e) {
        throw e
    }
}
export default resend