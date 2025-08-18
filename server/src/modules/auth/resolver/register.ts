import user from '@models/user.js'
import generateCode from '@services/verification/generateCode.js'
import cookie from '@services/account/cookie.js'
import { hash } from '@utils/security/hash.js'
import { validateName, formatName } from '@utils/validators/name.js'
import { validateUsername, formatUsername } from '@utils/validators/username.js'
import validateEmail from '@utils/validators/email.js'
import generateSvg from '@utils/misc/generateSvg.js'
import graphqlError from '@utils/misc/graphqlError.js'

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
        if (!show && pass !== rePass) errs['rePass'] = 'Password do not match!'
        if (Object.keys(errs).length > 0) graphqlError('Unprocessable Content', 422, errs)
        const newUser = new user({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(username),
            email,
            pass: await hash(pass)
        })
        await newUser.save()
        await generateCode('verify', newUser, false)
        cookie(newUser, res)
        return true
    } catch (e) {
        throw e
    }
}
export default register