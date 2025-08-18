import Redis from '@database/Redis.js'
import userModel from '@models/user.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
export default async (userId: string) => {
    const userKey = sanitizeRedisKey('user', userId)
    const verifyKey = sanitizeRedisKey('verify', userId)
    const resendKey = sanitizeRedisKey('resend', userId)
    const user = await userModel.findByIdAndUpdate(new TypesObjectId(userId), { verified: true }, { new: true })
    await Redis.json.SET(userKey, '$.verified', user!.verified)
    await Redis.DEL([verifyKey, resendKey])
}