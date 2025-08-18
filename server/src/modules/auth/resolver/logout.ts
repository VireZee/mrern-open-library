import Redis from '@database/Redis.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import type { User } from '@type/models/user.d.ts'

const logout = async (_: null, __: null, context: { res: Res, user: User }) => {
    try {
        const { res, user } = context
        const key = sanitizeRedisKey('user', user._id)
        await Redis.DEL(key)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default logout