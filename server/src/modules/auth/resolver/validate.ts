import Redis from '@database/Redis.ts'
import { sanitizeRedisKey } from '@utils/security/sanitizer.ts'

const validate = async (_: null, args: { id: string, token: string }) => {
    try {
        const { id, token } = args
        const key = sanitizeRedisKey('verify', id)
        const code = await Redis.HGET(key, 'code')
        if (token !== code) return false
        return true
    } catch (e) {
        throw e
    }
}
export default validate