import userModel from '@models/user.ts'
import { verifyHash } from '@utils/security/hash.ts'
import authService from '@services/auth.ts'

const login = async (_: null, args: { emailOrUname: string, pass: string }, context: { res: Res }) => {
    try {
        const { emailOrUname, pass } = args
        const { res } = context
        const user = await userModel.findOne({
            $or: [
                { email: emailOrUname.toLowerCase() },
                { username: emailOrUname.toLowerCase() }
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