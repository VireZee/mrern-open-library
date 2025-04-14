
import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'
import formatTimeLeft from '@utils/formatter/formatTimeLeft.ts'
import emailService from '@services/email.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user: authUser } = context
        const resendKey = sanitizeRedisKey('resend', authUser._id)
        const verifyKey = sanitizeRedisKey('verify', authUser._id)
        const getResend = await Redis.HGETALL(resendKey)
        const generateVerificationCode = async () => {
            const randomString = nodeCrypto.randomBytes(64).toString('hex')
            const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
            await Redis.HSET(verifyKey, 'code', verificationCode)
            await Redis.HEXPIRE(verifyKey, 'code', 300)
            await emailService(authUser.email, verificationCode, user)
        }
        const block = await Redis.HEXISTS(verifyKey, 'block')
        if (block) {
            const blockTTL = await Redis.HTTL(verifyKey, 'block')
            const timeLeft = formatTimeLeft(blockTTL)
            throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        }
        if (!Object.keys(getResend).length) {
            await generateVerificationCode()
            await Redis.HSET(resendKey, 'attempts', 1)
        } else {
            const block = await Redis.HEXISTS(resendKey, 'block')
            if (block) {
                const blockTTL = await Redis.call('HTTL', resendKey, 'FIELDS', 1, 'block') as number
                const timeLeft = formatTimeLeft(blockTTL)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
            const increment = await Redis.HINCRBY(resendKey, 'attempts', 1)
            if (increment % 3 === 0) {
                await Redis.HDEL(verifyKey, 'code')
                await Redis.HSET(resendKey, 'block', '')
                const blockDuration = 60 * 60 * (2 ** ((increment / 3) - 1))
                await Redis.call('HEXPIRE', resendKey, blockDuration, 'FIELDS', 1, 'block')
                const timeLeft = formatTimeLeft(blockDuration)
                throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
            }
        }
        await generateVerificationCode()
        return true
    } catch (e) {
        throw e
    }
}
export default resend