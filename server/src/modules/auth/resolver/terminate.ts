import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import collection from '@models/collection.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const terminate = async (_: null, __: null, context: { res: Res, user: User }) => {
    try {
        const { res, user } = context
        const key = sanitizeRedisKey('*', user._id)
        await collection.deleteMany({ user_id: user._id })
        await userModel.findByIdAndDelete(user._id)
        const keys = await Redis.KEYS(key)
        if (keys.length > 0) await Redis.DEL(keys)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default terminate