
import Redis from '../../../database/Redis.ts'
import nodemailer from 'nodemailer'
import a from '../../../models/users.ts'
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
const Resend = async (_: null, __: null, context: { user: any }) => {
    const { user } = context
    try {
        const resendKey = `resend:${user.id}`
        const verifyKey = `verify:${user.id}`
        // const getResend = await Redis.hgetall(resendKey)
        const generateVerificationCode = async () => {
            const user = await a.findById(context.user.id)
            const randomString = crypto.randomBytes(64).toString('hex')
            const verificationCode = crypto.createHash('sha512').update(randomString).digest('hex')
            // await Redis.hset(verifyKey, 'code', verificationCode)
            // await Redis.call('HEXPIRE', verifyKey, 300, 'FIELDS', 1, 'code')
            await transporter.sendMail({
                from: process.env['MAIL_FROM'],
                to: user!.email,
                subject: 'Verify Your Email',
                html: `
                    <div style="max-width: 500px; margin: auto; font-family: Times New Roman; background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                        <h2 style="color: #333;">Verify Your Email</h2>
                        <p style="color: #555;">Use the code below to verify your email:</p>
                        <div style="font-size: 20px; font-weight: bold; background: #f3f3f3; padding: 12px 18px; border-radius: 5px; display: inline-block; word-break: break-all; margin: 10px;">
                            ${verificationCode}
                        </div>
                        <p style="color: #555;">Or click the button below:</p>
                        <a href="http://localhost:5173/verify/${user!._id}/${verificationCode}"
                            style="display: inline-block; background: #007BFF; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                            Verify Now
                        </a>
                        <p style="color: #888; font-size: 14px; margin-top: 10px;">This code will expire in 5 minutes.</p>
                    </div>
                `
            })
        }
        const formatTimeLeft = (seconds: number) => {
            const h = Math.floor(seconds / 3600)
            const m = Math.floor((seconds % 3600) / 60)
            const s = seconds % 60
            return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`
        }
        // const block = await Redis.hexists(verifyKey, 'block')
        // if (block) {
        //     const blockTTL = await Redis.call('HTTL', verifyKey, 'FIELDS', 1, 'block') as number
        //     const timeLeft = formatTimeLeft(blockTTL)
        //     throw new GraphQLError(`You have been temporarily blocked from verifying your code due to too many failed attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        // }
        // if (!Object.keys(getResend).length) {
        //     await generateVerificationCode()
        //     await Redis.hset(resendKey, 'attempts', 1)
        // } else {
        //     const block = await Redis.hexists(resendKey, 'block')
        //     if (block) {
        //         const blockTTL = await Redis.call('HTTL', resendKey, 'FIELDS', 1, 'block') as number
        //         const timeLeft = formatTimeLeft(blockTTL)
        //         throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        //     }
        //     const increment = await Redis.hincrby(resendKey, 'attempts', 1)
        //     if (increment % 3 === 0) {
        //         await Redis.hdel(verifyKey, 'code')
        //         await Redis.hset(resendKey, 'block', '')
        //         const blockDuration = 60 * 60 * (2 ** ((increment / 3) - 1))
        //         await Redis.call('HEXPIRE', resendKey, blockDuration, 'FIELDS', 1, 'block')
        //         const timeLeft = formatTimeLeft(blockDuration)
        //         throw new GraphQLError(`Too many resend attempts! Try again in ${timeLeft}!`, { extensions: { code: 429 } })
        //     }
        //     await generateVerificationCode()
        return true
    } catch (e) {
        throw e
    }
}
export default Resend