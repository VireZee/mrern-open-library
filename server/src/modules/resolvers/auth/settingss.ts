import type {  Response } from 'express'
import Redis from '../../../database/Redis.ts'
import type { IUser } from '../../../models/user.ts'
import userModel from '../../../models/user.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import { hash, verifyHash } from '@utils/security/hash.ts'
import generateToken from '../../../utils/security/jwt.ts'
import { GraphQLError } from 'graphql'

const Settings = async (_: null, args: { photo: string, name: string, uname: string, email: string, oldPass: string, newPass: string, rePass: string, show: boolean }, context: {  res: Response, user: any }) => {
    try {
        const {  res } = context
        const { photo, name, uname, email, oldPass, newPass, rePass, show } = args
        const errs: Record<string, string> = {}
        const user = await userModel.findById(context.user.id)
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
            const newCachedUser = await userModel.findByIdAndUpdate(context.user.id, updatedUser, { new: true })
            if (updatedUser.photo) await Redis.call('JSON.SET', `user:${context.user.id}`, '$.photo', `${newCachedUser!.photo.toString()}`)
            if (updatedUser.name) await Redis.call('JSON.SET', `user:${context.user.id}`, '$.name', `${newCachedUser!.name}`)
            if (updatedUser.username) await Redis.call('JSON.SET', `user:${context.user.id}`, '$.username', `${newCachedUser!.username}`)
            if (updatedUser.email) await Redis.call('JSON.SET', `user:${context.user.id}`, '$.email', `${newCachedUser!.email}`)
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