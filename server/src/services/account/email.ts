import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env['MAIL_HOST'],
    port: process.env['MAIL_PORT'],
    secure: false,
    auth: {
        user: process.env['MAIL_USER'],
        pass: process.env['MAIL_PASS']
    }
} as Parameters<typeof nodemailer.createTransport>[0])
export const verifyEmail = async (email: string, verificationCode: string, user: { _id: string }) => {
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
                <a href="http://${process.env['DOMAIN']}:${process.env['PORT']}/verify/${user._id}/${verificationCode}"
                    style="display: inline-block; background: #007BFF; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                    Verify Now
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 10px;">This code will expire in 5 minutes.</p>
            </div>
        `
    })
}
export const resetPassword = async (email: string, verificationCode: string, user: { _id: string }) => {
    await transporter.sendMail({
        from: process.env['MAIL_FROM'],
        to: email,
        subject: 'Reset Your Password',
        html: `
            <div style="max-width: 500px; margin: auto; font-family: Times New Roman; background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p style="color: #555;">Click the button below to reset your password:</p>
                <a href="http://${process.env['DOMAIN']}:${process.env['PORT']}/reset/${user._id}/${verificationCode}"
                    style="display: inline-block; background: #007BFF; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
                    Verify Now
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 10px;">This reset will expire in 5 minutes.</p>
            </div>
        `
    })
}