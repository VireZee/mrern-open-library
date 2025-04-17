import Redis from '@database/Redis.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const check = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user: authUser } = context
        const key = sanitizeRedisKey('user', authUser._id)
        const cache = await Redis.json.GET(key) as User
        if (cache) return cache!.api_key ? cache!.api_key.toString() : null
        return authUser!.api_key ? authUser!.api_key.toString() : null
    } catch (e) {
        throw e
    }
}
export default check