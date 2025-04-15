import Redis from '@database/Redis.ts'
import user from '@models/user.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'
import formatTimeLeft from '@utils/formatter/timeLeft.ts'

const Verify = async (_: null, args: { code: string }, context: { user: User }) => {
    try {
        const { code } = args
        const { user: authUser } = context
        const verifyKey = sanitizeRedisKey('verify', authUser._id)
        const resendKey = sanitizeRedisKey('resend', authUser._id)
        const userKey = sanitizeRedisKey('user', authUser._id)
        const getVerify = await Redis.HGETALL(verifyKey)
        await Redis.HSETNX(verifyKey, 'attempts', '0')
        if (authUser!.verified) throw new GraphQLError('Already verified!', { extensions: { code: 409 } })
        if (!getVerify['code']) throw new GraphQLError('Verification code expired!', { extensions: { code: 400 } })
        const block = await Redis.HEXISTS(verifyKey, 'block')
        if (block) {
            const blockTTL = await Redis.HTTL(verifyKey, 'block')
            const timeLeft = formatTimeLeft(blockTTL![0]!)
            throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        } if (code !== getVerify['code']) {
            const increment = await Redis.HINCRBY(verifyKey, 'attempts', 1)
            if (increment % 3 === 0) {
                await Redis.HDEL(verifyKey, 'code')
                await Redis.HSET(verifyKey, 'block', '')
                const blockDuration = 60 * 30 * (2 ** ((increment / 3) - 1))
                Redis.HEXPIRE(verifyKey, 'block', blockDuration)
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            throw new GraphQLError('Invalid verification code!', { extensions: { code: '400' } })
        }
        const verifiedUser = await user.findByIdAndUpdate(authUser._id, { verified: true }, { new: true })
        await Redis.json.SET(userKey, '$.verified', `${verifiedUser!.verified}`)
        await Redis.DEL([verifyKey, resendKey])
        return true
    } catch (e) {
        throw e
    }
}
export default Verify