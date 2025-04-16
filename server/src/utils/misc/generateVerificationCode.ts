import Redis from '@database/Redis.ts'
import emailService from '@services/email.ts'

export default async (key: string, user: { _id: ObjectId | string, email: string }) => {
    const randomString = nodeCrypto.randomBytes(64).toString('hex')
    const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
    await Redis.HSET(key, 'code', verificationCode)
    await Redis.HEXPIRE(key, 'code', 300)
    await emailService(user.email, verificationCode, user)
}