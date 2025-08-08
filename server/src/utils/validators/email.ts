import user from '@models/user.ts'
export default async (email: string, id?: ObjectId) => {
    if (!email) return "Email can't be empty!"
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Email must be valid!'
    else if (await user.findOne({
        $or: [
            { googleId: { $exists: false } },
            { googleId: { $in: [null, ''] } }
        ],
        email,
        ...(id && { _id: { $ne: id } })
    })) return 'Email is already registered!'
    else if (await user.findOne({
        googleId: { $exists: true, $nin: [null, ''] },
        email,
        ...(id && { _id: { $ne: id } })
    })) return 'Email is already registered using Google!'
    return
}