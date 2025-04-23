import userModel from '@models/user.ts'
import { sanitize } from '@utils/security/sanitizer.ts'
import { hash } from '@utils/security/hash.ts'

const password = async (_: null, args: { pass: string, rePass: string, show: boolean }, req: Req) => {
    try {
        const { pass, rePass, show } = args
        const { userId, token } = req.params
        const id = sanitize(userId!)
        const user = await userModel.findById(id)
        if (token !== code) return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/error`)
        if (!pass) throw new GraphQLError("Password can't be empty!", { extensions: { code: 422 } })
        if (!show && pass !== rePass) throw new GraphQLError('Password do not match!', { extensions: { code: 422 } })
        const updatedUser: Partial<{ pass: string, updated: Date }> = {}
        updatedUser.pass = await hash(pass)
        updatedUser.updated = new Date()
        await userModel.findByIdAndUpdate(user!._id, updatedUser, { new: true }).lean()
        return true
    } catch (e) {
        throw e
    }
}
export default password