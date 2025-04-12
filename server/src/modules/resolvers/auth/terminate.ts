import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import collection from '@models/collection.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const terminate = async (_: null, __: null, context: { res: Res, user: User }) => {
    try {
        const { res, user } = context
        await collection.deleteMany({ user_id: user._id })
        await userModel.findByIdAndDelete(user._id)
        const keys = await Redis.KEYS(sanitizeRedisKey('*', user._id))
        if (keys.length > 0) await Redis.DEL(keys)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default terminate