import user from '@models/user.ts'
import { formatUsername } from '@utils/validators/username.ts'
export default async (base: string) => {
    let username = formatUsername(base)
    let suffix = 0
    while (await user.findOne({ username })) {
        username = formatUsername(base) + suffix
        suffix++
    }
    return username
}