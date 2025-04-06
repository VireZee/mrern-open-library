import { User } from '@models/User.ts'

export const validateUsername = async (uname: string, id?: ObjectId) => {
    if (!uname) {
        return "Username can't be empty!"
    } else if (!/^[\w\d]+$/.test(uname)) {
        return "Username can only contain Latin Alphabets, Numbers, and Underscores!"
    } else if (uname.length >= 20) {
        return "Username is too long!"
    } else if (await User.findOne({
        username: formatUsername(uname),
        ...(id && { _id: { $ne: id } })
    })) {
        return "Username is unavailable!"
    }
    return
}
export const formatUsername = (uname: string) => uname.toLowerCase()