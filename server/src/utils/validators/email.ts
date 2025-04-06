import { User } from '@models/User.ts'

export const validateEmail = async (email: string, id?: ObjectId) => {
    if (!email) {
        return "Email can't be empty!"
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return "Email must be valid!"
    } else if (await User.findOne({
        email,
        ...(id && { _id: { $ne: id } })

    })) {
        return "Email is already registered!"
    }
    return
}