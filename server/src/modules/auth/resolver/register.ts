import user from '@models/user.ts'
import generateVerificationCodeService from '@services/user/generateVerificationCode.ts'
import authService from '@services/user/auth.ts'
import { hash } from '@utils/security/hash.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import generateSvg from '@utils/misc/generateSvg.ts'

const register = async (_: null, args: { name: string, username: string, email: string, pass: string, rePass: string, show: boolean }, context: { res: Res }) => {
    try {
        const { name, username, email, pass, rePass, show } = args
        const { res } = context
        const errs: Record<string, string> = {}
        const nameErr = validateName(name)
        const usernameErr = await validateUsername(username)
        const emailErr = await validateEmail(email)
        if (nameErr) errs['name'] = nameErr
        if (usernameErr) errs['username'] = usernameErr
        if (emailErr) errs['email'] = emailErr
        if (!pass) errs['pass'] = "Password can't be empty!"
        if (!show && pass !== rePass) errs['rePass'] = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: 422 } })
        const newUser = new user({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(username),
            email,
            pass: await hash(pass)
        })
        await newUser.save()
        generateVerificationCodeService('verify', newUser)
        authService(newUser, res)
        return true
    } catch (e) {
        throw e
    }
}
export default register