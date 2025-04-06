import { User } from '@models/User.ts'

const Check = async (_: null, __: null, context: { user: any }) => {
    try {
        const user = await User.findById(context.user.id)
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default Check