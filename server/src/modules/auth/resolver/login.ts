import userModel from '@models/user.ts'
import authService from '@services/user/auth.ts'
import { verifyHash } from '@utils/security/hash.ts'

const login = async (_: null, args: { emailOrUsername: string, pass: string }, context: { res: Res }) => {
    try {
        const { emailOrUsername, pass } = args
        const { res } = context
        const user = await userModel.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        })
        if (!user || !(await verifyHash(pass, user!.pass))) throw new GraphQLError('Invalid login credentials!', { extensions: { code: 401 } })
        authService(user, res)
        return true
    } catch (e) {
        throw e
    }
}
export default login