import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import cookie from '@services/account/cookie.ts'
import { hash, verifyHash } from '@utils/security/hash.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import { validateName, formatName } from '@utils/validators/name.ts'
import { validateUsername, formatUsername } from '@utils/validators/username.ts'
import validateEmail from '@utils/validators/email.ts'
import graphqlError from '@utils/misc/graphqlError.ts'
import type { User, UserSettings } from '@type/models/user.d.ts'

const settings = async (_: null, args: { photo: string, name: string, username: string, email: string, oldPass: string, newPass: string, rePass: string, show: boolean }, context: { res: Res, user: User }) => {
    try {
        const { photo, name, username, email, oldPass, newPass, rePass, show } = args
        const { res, user: authUser } = context
        const key = sanitizeRedisKey('user', authUser._id)
        const errs: Record<string, string> = {}
        const user = await userModel.findById(authUser._id)
        const nameErr = validateName(name)
        const usernameErr = await validateUsername(username, user!._id)
        const emailErr = await validateEmail(email, user!._id)
        if (Buffer.byteLength(photo, 'base64') > 5592405) errs['photo'] = 'Image size must not exceed 8MB (MiB)'
        if (nameErr) errs['name'] = nameErr
        if (usernameErr) errs['username'] = usernameErr
        if (emailErr) errs['email'] = emailErr
        if (user!.pass !== null) {
            if (oldPass && !newPass) errs['newPass'] = "New password can't be empty!"
            if ((newPass && !oldPass) || (newPass && !(await verifyHash(oldPass, user!.pass!)))) errs['oldPass'] = 'Invalid current password'
            if (newPass && await verifyHash(newPass, user!.pass!)) errs['newPass'] = "The new password can't be the same as the current password!"
        } else if (user!.pass === null) if (oldPass) errs['oldPass'] = "You don't need to enter current password"
        if (!show && newPass !== rePass) errs['rePass'] = 'Password do not match!'
        if (Object.keys(errs).length > 0) graphqlError('Unprocessable Content', 422, errs)
        const updatedUser: Partial<UserSettings> = {}
        if (photo && photo !== authUser.photo) updatedUser.photo = photo
        if (name && name !== authUser.name) updatedUser.name = formatName(name)
        if (username && username !== authUser.username) updatedUser.username = formatUsername(username)
        if (email && email !== authUser.email) updatedUser.email = email
        if (newPass) updatedUser.pass = await hash(newPass)
        if (Object.keys(updatedUser).length > 0) {
            updatedUser.updated = new Date()
            const newCache = await userModel.findByIdAndUpdate(authUser._id, { ...updatedUser, photo: Buffer.from(photo, 'base64') }, { new: true }).lean()
            if (updatedUser.photo) await Redis.json.SET(key, '$.photo', newCache!.photo.toString('base64'))
            if (updatedUser.name) await Redis.json.SET(key, '$.name', newCache!.name)
            if (updatedUser.username) await Redis.json.SET(key, '$.username', newCache!.username)
            if (updatedUser.email) await Redis.json.SET(key, '$.email', newCache!.email)
            cookie(newCache!, res)
        }
        return true
    } catch (e) {
        throw e
    }
}
export default settings