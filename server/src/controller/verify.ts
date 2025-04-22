import Redis from '@database/Redis.ts'
import setToVerified from '@services/verification/setToVerified.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'
import type { User } from '@type/models/user.d.ts'

const verify = async (req: Req, res: Res) => {
    try {
        const { userId, hash } = req.params
        const userKey = sanitizeRedisKey('user', userId!)
        const verifyKey = sanitizeRedisKey('verify', userId!)
        const user = await Redis.json.GET(userKey) as User
        const code = await Redis.HGET(verifyKey, 'code')
        if (!user!.verified && hash !== code) return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/error`)
        await setToVerified(userId!)
        return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`)
    } catch (e) {
        throw e
    }
}
export default verify