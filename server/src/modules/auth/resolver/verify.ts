import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import checkBlockService from '@services/user/block.ts'
import rateLimiterService from '@services/user/rateLimiter.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const verify = async (_: null, args: { code: string }, context: { user: User }) => {
    try {
        const { code } = args
        const { user } = context
        const verifyKey = sanitizeRedisKey('verify', user._id)
        const resendKey = sanitizeRedisKey('resend', user._id)
        const userKey = sanitizeRedisKey('user', user._id)
        const getVerify = await Redis.HGETALL(verifyKey)
        await Redis.HSETNX(verifyKey, 'attempts', '0')
        if (user!.verified) throw new GraphQLError('Already verified!', { extensions: { code: 409 } })
        if (!getVerify['code']) throw new GraphQLError('Verification code expired!', { extensions: { code: 400 } })
        checkBlockService('verify', user, 'You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in')
        if (code !== getVerify['code']) {
            rateLimiterService('verify', user, 60)
            throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        }
        const verifiedUser = await userModel.findByIdAndUpdate(user._id, { verified: true }, { new: true })
        await Redis.json.SET(userKey, '$.verified', `${verifiedUser!.verified}`)
        await Redis.DEL([verifyKey, resendKey])
        return true
    } catch (e) {
        throw e
    }
}
export default verify