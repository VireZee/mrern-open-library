import userModel from '@models/users.ts'
import type { Id } from '@type/index.d.ts'

const generate = async (_: null, __: null, context: { user: Id }) => {
    try {
        const { user: authUser } = context
        const user = await userModel.findById(authUser.id)
        let apiKey: string
        let isDuplicate: boolean
        do {
            const randomString = nodeCrypto.randomBytes(64).toString('hex')
            apiKey = nodeCrypto.createHash('sha3-512').update(randomString).digest('hex')
            isDuplicate = !!(await userModel.exists({ api_key: Buffer.from(apiKey, 'hex') }))
        } while (isDuplicate)
        user!.api_key = Buffer.from(apiKey, 'hex')
        await user!.save()
        return apiKey
    } catch (e) {
        throw e
    }
}
export default generate