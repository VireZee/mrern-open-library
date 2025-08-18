import user from '@models/user.js'
export const validateUsername = async (username: string, id?: ObjectId) => {
    if (!username) return "Username can't be empty!"
    else if (!/^[\w\d]+$/.test(username)) return 'Username can only contain Latin Alphabets, Numbers, and Underscores!'
    else if (username.length >= 20) return 'Username is too long!'
    else if (await user.findOne({
        username: formatUsername(username),
        ...(id && { _id: { $ne: id } })
    }).lean()) return 'Username is unavailable!'
    return
}
export const formatUsername = (username: string) => username.toLowerCase()