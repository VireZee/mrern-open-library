import userModel from '@models/user.js'
import collection from '@models/collection.js'
import scanAndDelete from '@services/redis/scanAndDelete.js'
import { sanitize } from '@utils/security/sanitizer.js'
import type { User } from '@type/models/user.d.ts'

const terminate = async (_: null, __: null, context: { res: Res, user: User }) => {
    try {
        const { res, user } = context
        const key = sanitize(user._id)
        const keysToDelete = `*${key}*`
        await collection.deleteMany({ user_id: user._id })
        await userModel.findByIdAndDelete(user._id)
        await scanAndDelete(keysToDelete)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default terminate