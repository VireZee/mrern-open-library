import Redis from '@database/Redis.js'
import userModel from '@models/user.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import { hash } from '@utils/security/hash.js'
import graphqlError from '@utils/misc/graphqlError.js'

const reset = async (_: null, args: { id: string, token: string, pass: string, rePass: string, show: boolean }, context: { res: Res }) => {
    try {
        const { id, token, pass, rePass, show } = args
        const { res } = context
        const user = await userModel.findById(id)
        const verifyKey = sanitizeRedisKey('verify', id)
        const forgetKey = sanitizeRedisKey('forget', id)
        const code = await Redis.HGET(verifyKey, 'code')
        if (token !== code) return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/invalid`)
        if (!pass) graphqlError("Password can't be empty!", 422)
        if (!show && pass !== rePass) graphqlError('Password do not match!', 422)
        const updatedUser: Partial<{ pass: string, updated: Date }> = {}
        updatedUser.pass = await hash(pass)
        updatedUser.updated = new Date()
        await userModel.findByIdAndUpdate(user!._id, updatedUser, { new: true }).lean()
        await Redis.DEL([verifyKey, forgetKey])
        return true
    } catch (e) {
        throw e
    }
}
export default reset