import type { Response } from 'express'
import Redis from '../../../database/Redis.ts'
// import type SMTPTransport from 'nodemailer/lib/smtp-transport'
// import type { SentMessageInfo } from 'nodemailer'
import nodemailer from 'nodemailer'
import user from '../../../models/users.ts'
import generateSvg from '@utils/misc/generateSvg.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import { hash } from '@utils/security/hash.ts'
import generateToken from '@utils/security/jwt.ts'
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
} as Parameters<typeof nodemailer.createTransport>[0])
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
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: 422 } })
        const randomString = crypto.randomBytes(64).toString('hex')
        const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
        const newUser = new user({
            photo: Buffer.from(generateSvg(name), 'base64'),
            name: formatName(name),
            username: formatUsername(uname),
            email,
            pass: await hash(pass)
        })
        const newUserKey = `verify:${newUser._id}`
        await newUser.save()
        // await Redis.hset(newUserKey, 'code', verificationCode)
        // await Redis.call('HEXPIRE', newUserKey, 300, 'FIELDS', 1, 'code')
        await transporter.sendMail({
            from: process.env['MAIL_FROM'],
            to: email,
            subject: 'Verify Your Email',
            html: `
                <div style="max-width: 500px; margin: auto; font-family: Times New Roman; background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="color: #333;">Verify Your Email</h2>
                    <p style="color: #555;">Use the code below to verify your email:</p>
                    <div style="font-size: 20px; font-weight: bold; background: #f3f3f3; padding: 12px 18px; border-radius: 5px; display: inline-block; word-break: break-all; margin: 10px;">
                        ${verificationCode}
                    </div>
                    <p style="color: #555;">Or click the button below:</p>
                    <a href="http://localhost:5173/verify/${newUser._id}/${verificationCode}"
                        style="display: inline-block; background: #007BFF; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                        Verify Now
                    </a>
                    <p style="color: #888; font-size: 14px; margin-top: 10px;">This code will expire in 5 minutes.</p>
                </div>
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