import Redis from '@database/Redis.ts'
import { verifyEmail } from '@services/account/email.ts'
import { resetPassword } from '@services/account/email.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

export default async (keyName: string, user: { _id: ObjectId | string, email: string }, isForget: boolean) => {
    const key = sanitizeRedisKey(keyName, user._id)
    const randomString = nodeCrypto.randomBytes(64).toString('hex')
    const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
    await Redis.HSET(key, 'code', verificationCode)
    await Redis.HEXPIRE(key, 'code', 300)
    if (isForget) return await resetPassword(user.email, verificationCode, user._id.toString())
    return await verifyEmail(user.email, verificationCode, user._id.toString())
}