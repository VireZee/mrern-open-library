import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import Collection from '@models/collection.ts'

const Delete = async (_: null, __: null, context: { res: Res, user: any }) => {
    const { res, user } = context
    try {
        await Collection.deleteMany({ user_id: user.id })
        await userModel.findByIdAndDelete(user.id)
        const keys = await Redis.keys(`*:${user.id}`)
        if (keys.length > 0) await Redis.del(...keys)
        res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Delete