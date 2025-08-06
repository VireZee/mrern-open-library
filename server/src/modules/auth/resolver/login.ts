import userModel from '@models/user.ts'
import cookie from '@services/account/cookie.ts'
import { verifyHash } from '@utils/security/hash.ts'
import graphqlError from '@utils/misc/graphqlError.ts'

const login = async (_: null, args: { emailOrUsername: string, pass: string }, context: { res: Res }) => {
    try {
        const { emailOrUsername, pass } = args
        const { res } = context
        const user = await userModel.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        }).lean()
        if (!user || !(await verifyHash(pass, user!.pass!))) graphqlError('Invalid login credentials!', 401)
        cookie(user!, res)
        return true
    } catch (e) {
        throw e
    }
}
export default login