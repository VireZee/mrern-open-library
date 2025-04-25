import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
export default async (userId: string) => {
    const userKey = sanitizeRedisKey('user', userId)
    const verifyKey = sanitizeRedisKey('verify', userId)
    const resendKey = sanitizeRedisKey('resend', userId)
    const user = await userModel.findByIdAndUpdate(new TypesObjectId(userId), { verified: true }, { new: true })
    await Redis.json.SET(userKey, '$.verified', user!.verified)
    await Redis.DEL([verifyKey, resendKey])
}