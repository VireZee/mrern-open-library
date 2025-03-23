import type { Response } from 'express'
import { User } from '../../../models/User.ts'
import { generateSvg, validateName, formatName, validateUsername, formatUsername, validateEmail, hash, generateToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Register = async (_: null, args: { name: string, uname: string, email: string, pass: string, rePass: string, show: boolean }, context: { res: Response }) => {
    try {
        const { name, uname, email, pass, rePass, show } = args
        const errs: Record<string, string> = {}
        const nameErr = validateName(name)
        const unameErr = await validateUsername(uname)
        const emailErr = await validateEmail(email)
        if (nameErr) errs['name'] = nameErr
        if (unameErr) errs['uname'] = unameErr
        if (emailErr) errs['email'] = emailErr
        if (!pass) errs['pass'] = "Password can't be empty!"
        if (!show && pass !== rePass) errs['rePass'] = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: '422' } })
        const newUser = new User({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(uname),
            email,
            pass: await hash(pass),
            created: new Date()
        })
        await newUser.save()
        const t = generateToken(newUser._id)
        context.res.cookie('!', t, {
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
export default Register