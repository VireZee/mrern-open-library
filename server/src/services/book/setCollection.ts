import Redis from '@database/Redis.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

export default async (keyName: string, user: { _id: string }) => {
    const key = sanitizeRedisKey(keyName, user._id)
    await Redis.json.SET(key, '$', [], { NX: true })
    await Redis.EXPIRE(key, 86400)
}