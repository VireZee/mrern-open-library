import Redis from '@database/Redis.ts'
import user from '@models/user.ts'
import { hash } from '@utils/security/hash.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import generateSvg from '@utils/misc/generateSvg.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'
import emailService from '@services/email.ts'
import authService from '@services/auth.ts'

const register = async (_: null, args: { name: string, uname: string, email: string, pass: string, rePass: string, show: boolean }, context: { res: Res }) => {
    try {
        const { name, uname, email, pass, rePass, show } = args
        const { res } = context
        const errs: Record<string, string> = {}
        const nameErr = validateName(name)
        const unameErr = await validateUsername(uname)
        const emailErr = await validateEmail(email)
        if (nameErr) errs['name'] = nameErr
        if (unameErr) errs['uname'] = unameErr
        if (emailErr) errs['email'] = emailErr
        if (!pass) errs['pass'] = "Password can't be empty!"
        if (!show && pass !== rePass) errs['rePass'] = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: 422 } })
        const randomString = nodeCrypto.randomBytes(64).toString('hex')
        const verificationCode = nodeCrypto.createHash('sha512').update(randomString).digest('hex')
        const newUser = new user({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(uname),
            email,
            pass: await hash(pass)
        })
        await newUser.save()
        const key = sanitizeRedisKey('verify', newUser._id.toString())
        await Redis.HSET(key, 'code', verificationCode)
        await Redis.HEXPIRE(key, 'code', 300)
        await emailService(email, verificationCode, newUser)
        authService(newUser, res)
        return true
    } catch (e) {
        throw e
    }
}
export default register