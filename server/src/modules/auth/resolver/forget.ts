import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { resetPassword } from '@services/account/email.ts'
import validateEmail from '@utils/validators/email.ts'

const forget = async (_: null, args: { email: string }) => {
    try {
        const { email } = args
        const emailErr = await validateEmail(email)
        if (emailErr) throw new GraphQLError(emailErr, { extensions: { code: 422 } })
        const user = await userModel.findOne({ email })
        const key = sanitizeRedisKey('forget', user!._id.toString())
        const randomString = nodeCrypto.randomBytes(64).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
        await Redis.HSET(key, 'code', verificationCode)
        await Redis.HEXPIRE(key, 'code', 300)
        if (user) await 'hehehe?'
        return 'A verification code has been sent to your email address, provided it is registered in our system.'
    } catch (e) {
        throw e
    }
}
export default forget