import userModel from '@models/user.ts'
import type User from '@type/models/user.d.ts'

const check = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user: authUser } = context
        const user = await userModel.findById(authUser._id)
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default check