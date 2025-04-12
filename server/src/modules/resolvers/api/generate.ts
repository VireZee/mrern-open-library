import Redis from '@database/Redis.ts'
import userModel from '@models/user.ts'
import type User from '@type/models/user.d.ts'
import { sanitizeRedisKey } from '@utils/misc/sanitizer.ts'

const generate = async (_: null, __: null, context: { user: User }) => {
    try {
        const { user: authUser } = context
        const user = await userModel.findById(authUser._id)
        const key = sanitizeRedisKey('user', authUser._id)
        let apiKey: string
        let isDuplicate: boolean
        do {
            const randomString = nodeCrypto.randomBytes(64).toString('hex')
            apiKey = nodeCrypto.createHash('sha3-512').update(randomString).digest('hex')
            isDuplicate = !!(await userModel.exists({ api_key: Buffer.from(apiKey, 'hex') }))
        } while (isDuplicate)
        user!.api_key = Buffer.from(apiKey, 'hex')
        await user!.save()
        await Redis.json.SET(key, '$.api_key', apiKey)
        return apiKey
    } catch (e) {
        throw e
    }
}
export default generate