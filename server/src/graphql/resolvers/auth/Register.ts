import type { Response } from 'express'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import nodemailer from 'nodemailer'
import { User } from '../../../models/User.ts'
import { generateSvg, validateName, formatName, validateUsername, formatUsername, validateEmail, hash, generateToken } from '../../../utils/Validation.ts'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'

const transporter = nodemailer.createTransport({
    host: process.env['MAIL_HOST'],
    port: process.env['MAIL_PORT'],
    secure: false,
    auth: {
        user: process.env['MAIL_USER'],
        pass: process.env['MAIL_PASS']
    }
} as SMTPTransport.Options)
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
        const randomString = crypto.randomBytes(64).toString('hex')
        const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
        const newUser = new User({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(uname),
            email,
            pass: await hash(pass),
            verificationCode,
            codeExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })
        await newUser.save()
        await transporter.sendMail({
            from: '"My App" <no-reply@myapp.com>',
            to: email,
            subject: "Verify Your Email",
            html: `
                <p>Your verification code: <strong>${verificationCode}</strong></p>
                <p>Or click the button below to verify:</p>
                <a href="http://localhost:5173/verify?email=${email}&code=${verificationCode}" style="padding: 10px 20px; background: blue; color: white; text-decoration: none;">Verify Now</a>
                <p>This code will expire in 5 minutes.</p>
            `
        })
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