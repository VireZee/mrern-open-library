import type { Request, Response } from 'express'
import Redis from '../../../database/Redis.ts'
import type { IUser } from '../../../models/User.ts'
import { User } from '../../../models/User.ts'
import { validateName, formatName, validateUsername, formatUsername, validateEmail, hash, verifyHash, generateToken, verifyToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Settings = async (_: null, args: { photo: string, name: string, uname: string, email: string, oldPass: string, newPass: string, rePass: string, show: boolean }, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const { id } = verifyToken(t)
        const { photo, name, uname, email, oldPass, newPass, rePass, show } = args
        const errs: Record<string, string> = {}
        const user = await User.findById(id)
        const nameErr = validateName(name)
        const unameErr = await validateUsername(uname, user!._id)
        const emailErr = await validateEmail(email, user!._id)
        if (Buffer.byteLength(photo, 'base64') > 5592405) errs['photo'] = "Image size must not exceed 8MB (MiB)"
        if (nameErr) errs['name'] = nameErr
        if (unameErr) errs['uname'] = unameErr
        if (emailErr) errs['email'] = emailErr
        if (oldPass && !newPass) errs['newPass'] = "New password can't be empty!"
        if ((newPass && !oldPass) || (newPass && !(await verifyHash(oldPass, user!.pass)))) errs['oldPass'] = "Invalid current password"
        if (newPass && await verifyHash(newPass, user!.pass)) errs['newPass'] = "The new password can't be the same as the current password!"
        if (!show && newPass !== rePass) errs['rePass'] = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: '422' } })
        const updatedUser: Partial<IUser> = {}
        if (photo && Buffer.compare(Buffer.from(photo, 'base64'), user!.photo) !== 0) updatedUser.photo = Buffer.from(photo, 'base64')
        if (name && name !== user!.name) updatedUser.name = formatName(name)
        if (uname && uname !== user!.username) updatedUser.username = formatUsername(uname)
        if (email && email !== user!.email) updatedUser.email = email
        if (newPass) updatedUser.pass = await hash(newPass)
        if (Object.keys(updatedUser).length > 0) {
            updatedUser.updated = new Date()
            const newCachedUser = await User.findByIdAndUpdate(id, updatedUser, { new: true })
            await Redis.del(`user:${id}`)
            await Redis.call('JSON.SET', `user:${id}`, '$', JSON.stringify({
                photo: newCachedUser!.photo.toString(),
                name: newCachedUser!.name,
                username: newCachedUser!.username,
                email: newCachedUser!.email
            }))
            const t = generateToken(user!._id)
            res.cookie('!', t, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: process.env['NODE_ENV'] === 'production',
                sameSite: "strict",
                priority: "high"
            })
        }
        return true
    } catch (e) {
        throw e
    }
}
export default Settings