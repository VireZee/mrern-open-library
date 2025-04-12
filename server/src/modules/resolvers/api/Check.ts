import userModel from '@models/user.ts'
import type { Id } from '@type/index.d.ts'

const check = async (_: null, __: null, context: { user: Id }) => {
    try {
        const { user: authUser } = context
        const user = await userModel.findById(authUser.id)
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default check