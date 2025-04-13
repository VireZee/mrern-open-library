import userModel from '@models/user.ts'
import { verifyHash } from '@utils/security/hash.ts'
import generateToken from '@utils/security/jwt.ts'

const Login = async (_: null, args: { emailOrUname: string, pass: string }, context: { res: Res }) => {
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
        const t = generateToken(user._id)
        res.cookie('!', t, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: "strict",
            priority: "high"
        })
        return true
    } catch (e) {
        throw e
    }
}
export default Login