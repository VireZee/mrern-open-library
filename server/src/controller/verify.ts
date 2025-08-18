import Redis from '@database/Redis.js'
import setToVerified from '@services/verification/setToVerified.js'
import { sanitizeRedisKey } from '@utils/security/sanitizer.js'
import type { User } from '@type/models/user.d.ts'

const verify = async (req: Req, res: Res) => {
    try {
        const { id, token } = req.params
        const userKey = sanitizeRedisKey('user', id!)
        const verifyKey = sanitizeRedisKey('verify', id!)
        const user = await Redis.json.GET(userKey) as User
        const code = await Redis.HGET(verifyKey, 'code')
        if (!user!.verified && token !== code) return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}/error`)
        await setToVerified(id!)
        return res.redirect(`http://${process.env['DOMAIN']}:${process.env['CLIENT_PORT']}`)
    } catch (e) {
        throw e
    }
}
export default verify