import userModel from '@models/user.ts'
import cookie from '@services/account/cookie.ts'
import { verifyHash } from '@utils/security/hash.ts'
import graphqlError from '@utils/misc/graphqlError.ts'

const login = async (_: null, args: { emailOrUsername: string, pass: string }, context: { res: Res }) => {
    try {
        const { emailOrUsername, pass } = args
        const { res } = context
        const user = await userModel.findOne({
            $and: [
                {
                    $or: [
                        { googleId: { $exists: false } },
                        { googleId: { $in: [null, ''] } }
                    ]
                },
                {
                    $or: [
                        { email: emailOrUsername.toLowerCase() },
                        { username: emailOrUsername.toLowerCase() }
                    ]
                }
            ]
        }).lean()
        const googleUser = await userModel.findOne({
            googleId: { $exists: true, $nin: [null, ''] },
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        }).lean()
        if (!user || !(await verifyHash(pass, user!.pass!))) graphqlError('Invalid login credentials!', 401)
        if (googleUser) graphqlError('Account is registered using Google! Try logging in with Google!', 401)
        cookie(user!, res)
        return true
    } catch (e) {
        throw e
    }
}
export default login