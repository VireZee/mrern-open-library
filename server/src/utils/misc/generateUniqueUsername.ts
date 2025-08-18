import user from '@models/user.js'
import { formatUsername } from '@utils/validators/username.js'
export default async (base: string) => {
    let username = formatUsername(base)
    let suffix = 0
    while (await user.findOne({ username })) {
        username = formatUsername(base) + suffix
        suffix++
    }
    return username
}