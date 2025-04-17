import Redis from '@database/Redis.ts'
import emailService from '@services/user/email.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

export default async (keyName: string, user: { _id: ObjectId | string, email: string }) => {
    const key = sanitizeRedisKey(keyName, user._id.toString())
    const randomString = nodeCrypto.randomBytes(64).toString('hex')
    const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
    await Redis.HSET(key, 'code', verificationCode)
    await Redis.HEXPIRE(key, 'code', 300)
    await emailService(user.email, verificationCode, { _id: user._id.toString() })
}