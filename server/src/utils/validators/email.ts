import user from '@models/user.ts'

const validateEmail = async (email: string, id?: ObjectId) => {
    if (!email) {
        return "Email can't be empty!"
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return "Email must be valid!"
    } else if (await user.findOne({
        email,
        ...(id && { _id: { $ne: id } })
    })) {
        return "Email is already registered!"
    }
    return
}
export default validateEmail