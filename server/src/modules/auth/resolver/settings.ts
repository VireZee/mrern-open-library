import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import type { User, UserSettings } from '@type/models/user.d.ts'
import authService from '@services/auth.ts'
import { hash, verifyHash } from '@utils/security/hash.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

const settings = async (_: null, args: { photo: string, name: string, uname: string, email: string, oldPass: string, newPass: string, rePass: string, show: boolean }, context: { res: Res, user: User }) => {
    try {
        const { photo, name, uname, email, oldPass, newPass, rePass, show } = args
        const { res, user: authUser } = context
        const key = sanitizeRedisKey('user', authUser._id)
        const errs: Record<string, string> = {}
        const user = await userModel.findById(authUser._id)
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
        const updatedUser: Partial<UserSettings> = {}
        if (photo && photo !== authUser.photo) updatedUser.photo = photo
        if (name && name !== authUser.name) updatedUser.name = formatName(name)
        if (uname && uname !== authUser.username) updatedUser.username = formatUsername(uname)
        if (email && email !== authUser.email) updatedUser.email = email
        if (newPass) updatedUser.pass = await hash(newPass)
        if (Object.keys(updatedUser).length > 0) {
            updatedUser.updated = new Date()
            const newCache = await userModel.findByIdAndUpdate(authUser._id, updatedUser, { new: true })
            if (updatedUser.photo) await Redis.json.SET(key, '$.photo', Buffer.from(newCache!.photo).toString('base64'))
            if (updatedUser.name) await Redis.json.SET(key, '$.name', newCache!.name)
            if (updatedUser.username) await Redis.json.SET(key, '$.username', newCache!.username)
            if (updatedUser.email) await Redis.json.SET(key, '$.email', newCache!.email)
            authService(newCache!, res)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default settings