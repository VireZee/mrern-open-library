import userModel from '@models/user.js'
import cookie from '@services/account/cookie.js'
import { verifyHash } from '@utils/security/hash.js'
import graphqlError from '@utils/misc/graphqlError.js'

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
        if (user!.pass === null) graphqlError('Account is registered using Google! Try logging in with Google!', 401)
        if ((!user || !(await verifyHash(pass, user.pass!)))) graphqlError('Invalid login credentials!', 401)
        cookie(user!, res)
        return true
    } catch (e) {
        throw e
    }
}
export default login