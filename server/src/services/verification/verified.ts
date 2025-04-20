import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

export default async (objectId: string) => {
    const userKey = sanitizeRedisKey('user', objectId)
    const verifyKey = sanitizeRedisKey('verify', objectId)
    const resendKey = sanitizeRedisKey('resend', objectId)
    const verifiedUser = await userModel.findByIdAndUpdate(new TypesObjectId(objectId), { verified: true }, { new: true })
    await Redis.json.SET(userKey, '$.verified', verifiedUser!.verified)
    await Redis.DEL([verifyKey, resendKey])
}