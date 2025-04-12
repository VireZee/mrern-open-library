import Redis from '@database/Redis.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const logout = async (_: null, __: null, context: { res: Res, user: User }) => {
    try {
        const { res, user } = context
        const key = sanitizeRedisKey('user', user._id)
        await Redis.del(key)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default logout