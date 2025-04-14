
import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'
import emailService from '@services/email.ts'

const resend = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user: authUser } = context
        const resendKey = sanitizeRedisKey('resend', authUser._id)
        const verifyKey = sanitizeRedisKey('verify', authUser._id)
        const getResend = await Redis.HGETALL(resendKey)
        const generateVerificationCode = async () => {
            const user = await userModel.findById(authUser._id)
            const randomString = nodeCrypto.randomBytes(64).toString('hex')
            const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
            // await Redis.hset(verifyKey, 'code', verificationCode)
            // await Redis.call('HEXPIRE', verifyKey, 300, 'FIELDS', 1, 'code')
            await emailService(user.email, verificationCode, user)
        }
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        // const block = await Redis.hexists(verifyKey, 'block')
        // if (block) {
        //     const blockTTL = await Redis.call('HTTL', verifyKey, 'FIELDS', 1, 'block') as number
        //     const timeLeft = formatTimeLeft(blockTTL)
        //     throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        // }
        // if (!Object.keys(getResend).length) {
        //     await generateVerificationCode()
        //     await Redis.hset(resendKey, 'attempts', 1)
        // } else {
        //     const block = await Redis.hexists(resendKey, 'block')
        //     if (block) {
        //         const blockTTL = await Redis.call('HTTL', resendKey, 'FIELDS', 1, 'block') as number
        //         const timeLeft = formatTimeLeft(blockTTL)
        //         throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        //     }
        //     const increment = await Redis.hincrby(resendKey, 'attempts', 1)
        //     if (increment % 3 === 0) {
        //         await Redis.hdel(verifyKey, 'code')
        //         await Redis.hset(resendKey, 'block', '')
        //         const blockDuration = 60 * 60 * (2 ** ((increment / 3) - 1))
        //         await Redis.call('HEXPIRE', resendKey, blockDuration, 'FIELDS', 1, 'block')
        //         const timeLeft = formatTimeLeft(blockDuration)
        //         throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        //     }
        //     await generateVerificationCode()
        return true
    } catch (e) {
        throw e
    }
}
export default resend