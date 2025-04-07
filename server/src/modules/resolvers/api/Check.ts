import userModel from '@models/user.ts'
import type { User } from '@type/index.d.ts'

const check = async (_: null, __: null, context: { user: User }) => {
    try {
        const user = await userModel.findById(context.user.id)
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default check