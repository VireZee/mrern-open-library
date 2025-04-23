import Redis from '@database/Redis.ts'
import block from '@services/account/block.ts'
import rateLimiter from '@services/verification/rateLimiter.ts'
import setToVerified from '@services/verification/setToVerified.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const verify = async (_: null, args: { code: string }, context: { user: User }) => {
    try {
        const { code } = args
        const { user } = context
        const key = sanitizeRedisKey('verify', user._id)
        const getVerify = await Redis.HGETALL(key)
        if (user!.verified) throw new GraphQLError('Already verified!', { extensions: { code: 409 } })
        if (!getVerify['code']) throw new GraphQLError('Verification code expired!', { extensions: { code: 400 } })
        await block('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (code !== getVerify['code']) {
            await rateLimiter('verify', user, 60)
            throw new GraphQLError('Invalid verification code!', { extensions: { code: 400 } })
        }
        await setToVerified(user._id)
        return true
    } catch (e) {
        throw e
    }
}
export default verify