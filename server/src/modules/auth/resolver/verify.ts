import Redis from '@database/Redis.ts'
import checkBlockService from '@services/account/block.ts'
import rateLimiterService from '@services/verification/rateLimiter.ts'
import verifiedService from '@services/verification/verified.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const verify = async (_: null, args: { code: string }, context: { user: User }) => {
    try {
        const { code } = args
        const { user } = context
        const key = sanitizeRedisKey('verify', user._id)
        const getVerify = await Redis.HGETALL(key)
        await Redis.HSETNX(key, 'attempts', '0')
        if (user!.verified) throw new GraphQLError('Already verified!', { extensions: { code: 409 } })
        if (!getVerify['code']) throw new GraphQLError('Verification code expired!', { extensions: { code: 400 } })
        await checkBlockService('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (code !== getVerify['code']) {
            await rateLimiterService('verify', user, 60)
            throw new GraphQLError('Invalid verification code!', { extensions: { code: 400 } })
        }
        await verifiedService(user._id)
        return true
    } catch (e) {
        throw e
    }
}
export default verify